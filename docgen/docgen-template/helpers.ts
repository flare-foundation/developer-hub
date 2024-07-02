import { HelperOptions, Utils } from "handlebars";
import { DocItemWithContext } from "solidity-docgen/src/site";
import { ContractDefinition, VariableDeclaration } from "solidity-ast";

/**
 * Returns a Markdown heading marker. An optional number increases the heading level.
 *
 *    Input                  Output
 *    {{h}} {{name}}         # Name
 *    {{h 2}} {{name}}       ## Name
 */
export function h(opts: HelperOptions): string;
export function h(hsublevel: number, opts: HelperOptions): string;
export function h(hsublevel: number | HelperOptions, opts?: HelperOptions) {
  const { hlevel } = getHLevel(hsublevel, opts);
  return new Array(hlevel).fill("#").join("");
}

/**
 * Delineates a section where headings should be increased by 1 or a custom number.
 *
 *    {{#hsection}}
 *    {{>partial-with-headings}}
 *    {{/hsection}}
 */
export function hsection(opts: HelperOptions): string;
export function hsection(hsublevel: number, opts: HelperOptions): string;
export function hsection(
  this: unknown,
  hsublevel: number | HelperOptions,
  opts?: HelperOptions,
) {
  let hlevel;
  ({ hlevel, opts } = getHLevel(hsublevel, opts));
  opts.data = Utils.createFrame(opts.data);
  opts.data.hlevel = hlevel;
  return opts.fn(this as unknown, opts);
}

/**
 * Helper for dealing with the optional hsublevel argument.
 */
function getHLevel(hsublevel: number | HelperOptions, opts?: HelperOptions) {
  if (typeof hsublevel === "number") {
    opts = opts!;
    hsublevel = Math.max(1, hsublevel);
  } else {
    opts = hsublevel;
    hsublevel = 1;
  }
  const contextHLevel: number = opts.data?.hlevel ?? 0;
  return { opts, hlevel: contextHLevel + hsublevel };
}

export function trim(text: string) {
  if (typeof text === "string") {
    return text.trim();
  }
}

export function joinLines(text?: string) {
  if (typeof text === "string") {
    return text.replace(/\n+/g, " ");
  }
}

/**
 * Checks if the item has the given nodeType (Will only work for DocItems).
 */
export function ifIsNodeType(
  this: unknown,
  nodeTypeName: string,
  opts: HelperOptions,
) {
  let fn =
    (this as DocItemWithContext).nodeType == nodeTypeName
      ? opts.fn
      : opts.inverse;
  if (fn) return fn(this as unknown, opts);
}

/**
 * Counts the number of items of the given nodeType (Will only work for Contracts).
 */
export function ifHasContent(
  this: unknown,
  nodeTypeName: string,
  opts: HelperOptions,
) {
  const count = (this as ContractDefinition).nodes.reduce(
    (accumulator, obj) => {
      if (obj.nodeType == nodeTypeName) {
        return accumulator + 1;
      }
      return accumulator;
    },
    0,
  );

  let fn = count > 0 ? opts.fn : opts.inverse;
  if (fn) return fn(this as unknown, opts);
}

function formatVariable(v: VariableDeclaration): string {
  return (
    "    " +
    [v.typeName?.typeDescriptions.typeString!].concat(v.name || []).join(" ")
  );
}

/**
 * Returns a signature string nicer than the "signature" accessor, because that's
 * on a single line.
 */
export function pretty_signature(this: DocItemWithContext): string | undefined {
  switch (this.nodeType) {
    case "ContractDefinition":
      return undefined;

    case "FunctionDefinition": {
      const { kind, name } = this;
      const params = this.parameters.parameters;
      const returns = this.returnParameters.parameters;
      const head =
        kind === "function" || kind === "freeFunction"
          ? [kind, name].join(" ")
          : kind;
      let res = [
        `${head}(\n${params.map(formatVariable).join(",\n")}\n)`,
        this.visibility,
      ];
      if (this.stateMutability !== "nonpayable") {
        res.push(this.stateMutability);
      }
      if (this.virtual) {
        res.push("virtual");
      }
      if (returns.length > 0) {
        res.push(`returns (\n${returns.map(formatVariable).join(",\n")})`);
      }
      return res.join(" ").replace("\n\n", "\n") + ";";
    }

    case "EventDefinition": {
      const params = this.parameters.parameters;
      return `event ${this.name}(\n${params.map(formatVariable).join(",\n")}\n)`.replace(
        "\n\n",
        "\n",
      );
    }

    case "ErrorDefinition": {
      const params = this.parameters.parameters;
      return `error ${this.name}(${params.map(formatVariable).join(",\n")})`;
    }

    case "ModifierDefinition": {
      const params = this.parameters.parameters;
      return `modifier ${this.name}(${params.map(formatVariable).join(",\n")})`;
    }

    case "VariableDeclaration":
      return formatVariable(this);
  }
}
