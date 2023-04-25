 const TOK_EQ = 'EQ',
  TOK_GT = 'GT',
  TOK_LT = 'LT',
  TOK_GTE = 'GTE',
  TOK_LTE = 'LTE',
  TOK_NE = 'NE';

export class ExcelToJsonFormula {

  numberRegEx = /\d+/

  constructor(rowNumberFieldMap, globals) {
    this.rowNumberFieldMap = rowNumberFieldMap;
    this.globals = globals;
  }

  transform(node, value) {
    this.expression = ""
    return this.visit(node, value);
  }

  visit(n, v) {
    const visitFunctions = {
      Field: (node) => {
        let name = node?.name;
        let match = this.numberRegEx.exec(name)
        let rowNo = match?.[0];
        let field = this.rowNumberFieldMap?.get(rowNo*1);
        if (!field) throw new Error(`Unknown column used in excel formula ${node.name}`);
        return field?.name;
      },

      Subexpression: (node) => {
        let result = this.visit(node.children[0]);
        for (let i = 1; i < node.children.length; i += 1) {
          result = this.visit(node.children[1]);
          if (result === null) return null;
        }
        return result;
      },

      IndexExpression: (node) => {
        const left = this.visit(node.children[0]);
        return this.visit(node.children[1], left);
      },

      Comparator: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);

        if (node.name === TOK_EQ) return `(${first} == ${second})`;
        if (node.name === TOK_NE) return `(${first} != ${second})`
        if (node.name === TOK_GT) return `(${first} > ${second})`
        if (node.name === TOK_GTE) return`(${first} >= ${second})`
        if (node.name === TOK_LT) return `(${first} < ${second})`
        if (node.name === TOK_LTE) return `(${first} <= ${second})`
        throw new Error(`Unknown comparator: ${node.name}`);
      },

      MultiSelectList: (node) => {
        if (value === null) return null;
        return node.children.map(child => this.visit(child));
      },

      MultiSelectHash: (node) => {
        if (value === null) return null;
        const collected = {};
        node.children.forEach(child => {
          collected[child.name] = this.visit(child.value);
        });
        return collected;
      },

      OrExpression: (node) => {
        let matched = this.visit(node.children[0]);
        if (isFalse(matched)) matched = this.visit(node.children[1]);
        return matched;
      },

      AndExpression: (node) => {
        const first = this.visit(node.children[0]);

        if (isFalse(first) === true) return first;
        return this.visit(node.children[1]);
      },

      AddExpression: (node) => {
        const first = this.visit(node.children[0]);
        const second = this.visit(node.children[1]);
        return this.applyOperator(first, second, '+');
      },

      ConcatenateExpression: (node) => {
        let first = this.visit(node.children[0]);
        let second = this.visit(node.children[1]);
        return this.applyOperator(first, second, '&');
      },

      SubtractExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '-');
      },

      MultiplyExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '*');
      },

      DivideExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '/');
      },

      PowerExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '^');
      },

      UnaryMinusExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        return first * -1;
      },

      Literal: node => `'${node.value}'`,

      Number: node => node.value,

      Function: (node) => {
        const resolvedArgs = node.children.map(child => this.visit(child));
        return this.transformFunction(node, resolvedArgs);
      },
    };
    const fn = n && visitFunctions[n.type];
    if (!fn) throw new Error(`Unknown/missing node type ${(n && n.type) || ''}`);
    return fn(n, v);
  }

  applyOperator(first, second, operator) {
    return `(${first} ${operator} ${second})`;
  }

  transformFunction(node, resolvedArgs) {
    if(node.name == "min") {
      return `${node.name}([${resolvedArgs}])`
    }
    return `${node.name}(${resolvedArgs})`
  }
}
