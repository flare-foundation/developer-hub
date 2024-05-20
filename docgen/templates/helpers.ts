// @ts-ignore
import { HelperOptions, Utils } from "handlebars";
// @ts-ignore
import { DocItemWithContext } from "solidity-docgen/src/site";
import {
  ContractDefinition,
  EnumDefinition,
  ErrorDefinition,
  EventDefinition,
  FunctionDefinition,
  ModifierDefinition,
  StructDefinition,
  UserDefinedValueTypeDefinition,
  VariableDeclaration,
  // @ts-ignore
} from "solidity-ast";

const flareRepoURL =
  "https://github.com/flare-foundation/flare-smart-contracts-v2/blob/main";
const openzeppelinRepoURL =
  "https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v3.4";

var globalContractTable = new Set<String>();
var globalEnumTable = new Map<string, string>();

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
      this.modifiers.forEach((m) => {
        res.push(m.modifierName.name);
      });
      if (returns.length > 0) {
        res.push(`returns (\n${returns.map(formatVariable).join(",\n")}\n)`);
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

function createGlobalSymbolTables(ctx: DocItemWithContext) {
  if (!ctx.__item_context) return;
  for (var path in ctx.__item_context.build.output.sources) {
    if (path.startsWith("@")) continue;
    const contractName = path.split("/").pop()?.split(".")[0];
    if (!contractName) continue;
    globalContractTable.add(contractName);

    // Workaround for enums, which are not supported on solc prior to 0.8.20
    const content = ctx.__item_context.build.input.sources[path].content;
    if (!content) continue;
    // Search for the natspec comment before "enum".
    var re = /\/\*\*([^/]*?)\*\/\s*enum ([^ {]*)/g;
    var match;
    while ((match = re.exec(content)) !== null) {
      var text = match[1].replace(/\n\s*\* ?/g, "\n"); // Remove heading *
      text = text.replace(/\s*$/g, ""); // Remove trailing whitespace
      var enumName = match[2];
      globalEnumTable.set(`${contractName}.${enumName}`, text);
    }
  }
}

export function linkify(
  this: DocItemWithContext,
  text?: string,
  joinLines?: boolean,
) {
  createGlobalSymbolTables(this);
  const contract =
    this.nodeType === "ContractDefinition"
      ? this
      : this.__item_context?.contract;
  let ret = text || "";
  if (contract && typeof text === "string") {
    // Cleanup non-markdown syntax
    ret = ret.replace(/\{([^}]*)\}/g, "$1");
    // Look for references to field names (in this contract or any of its parents) and replace them with markdown links
  }
  // Look for references to other contract names. Same regex as before, same comments.
  if (joinLines) {
    ret = ret.replace(/\n\n/g, " ");
    ret = ret.replace(/\n+/g, " ");
  }
  return ret;
}

export function allItems(this: DocItemWithContext, nodeTypeName: string) {
  if (this.nodeType == "ContractDefinition") {
    const { deref } = this.__item_context.build;
    const allParents = this.linearizedBaseContracts.map(
      deref("ContractDefinition"),
    );
    let items: (
      | EnumDefinition
      | ErrorDefinition
      | EventDefinition
      | FunctionDefinition
      | ModifierDefinition
      | StructDefinition
      | UserDefinedValueTypeDefinition
      | VariableDeclaration
    )[] = [];
    allParents.forEach((p) => {
      p.nodes.forEach((n) => {
        // Filter out other types
        if (n.nodeType == "UsingForDirective" || n.nodeType != nodeTypeName)
          return;
        // Filter out private fields
        if (
          (n.nodeType == "VariableDeclaration" ||
            n.nodeType == "FunctionDefinition") &&
          n.visibility != "public" &&
          n.visibility != "external"
        )
          return;
        if (n.nodeType == "FunctionDefinition" && n.virtual) return;
        // If this item already exists do not add it again.
        // linearizedBaseContracts returned the children first and then the parents, so if the item
        // already exists it means that it is an override, and we want to keep those (if they had any docs).
        const prev = items.find((i) => {
          if (
            i.nodeType != "FunctionDefinition" ||
            n.nodeType != "FunctionDefinition"
          )
            return i.name == n.name;
          // For functions, compare their selectors (if any), as we want to keep all overloads.
          if (
            i.functionSelector == undefined &&
            n.functionSelector == undefined
          )
            return i.name == n.name;
          return i.functionSelector == n.functionSelector;
        });
        const prevDocs =
          prev &&
          (prev.nodeType == "ErrorDefinition" ||
            prev.nodeType == "EventDefinition" ||
            prev.nodeType == "FunctionDefinition")
            ? prev.documentation
            : null;
        if (!prev || !prevDocs) items.push(n);
      });
    });

    items.sort((a, b) => (a.name < b.name ? -1 : 1));
    return items;
  }
}

export function sourceFile(this: DocItemWithContext) {
  return flareRepoURL + "/" + this.__item_context.file.absolutePath;
}

export function ifHasParents(this: DocItemWithContext, opts: HelperOptions) {
  if (this.nodeType != "ContractDefinition") return;
  let fn = this.baseContracts.length != 0 ? opts.fn : opts.inverse;
  if (fn) return fn(this as unknown, opts);
}

function RepoURLfromPath(path: string): string {
  if (path.startsWith("@openzeppelin"))
    return path.replace("@openzeppelin", openzeppelinRepoURL);
  else return flareRepoURL + "/" + path;
}

export function parentContractName(this: DocItemWithContext) {
  if (this.__item_context.contract) {
    const { deref } = this.__item_context.build;
    const contract = deref(
      "ContractDefinition",
      this.__item_context.contract?.id,
    );
    return contract.name;
  }
}

export function parentContractLinks(this: DocItemWithContext) {
  if (this.__item_context.contract) {
    const { deref } = this.__item_context.build;
    const contract = deref(
      "ContractDefinition",
      this.__item_context.contract?.id,
    );
    const scope = deref("SourceUnit", contract.scope);
    return `[Source](${RepoURLfromPath(scope.absolutePath)})`;
  }
}

export function parents(this: DocItemWithContext) {
  if (this.nodeType != "ContractDefinition") return;
  const { deref } = this.__item_context.build;
  const parents = this.baseContracts.map((is) =>
    deref("InheritanceSpecifier", is.id),
  );
  return parents
    .map((is) => {
      const parent = deref(
        "ContractDefinition",
        is.baseName.referencedDeclaration,
      );
      const scope = deref("SourceUnit", parent.scope);
      if (scope.absolutePath.startsWith("@")) return is.baseName.name;
      return `[${is.baseName.name}](./${is.baseName.name}.md)`;
    })
    .join(", ");
}

export function enumDocs(this: DocItemWithContext): string | undefined {
  if (this.__item_context.contract) {
    const { deref } = this.__item_context.build;
    const contract = deref(
      "ContractDefinition",
      this.__item_context.contract?.id,
    );
    return globalEnumTable.get(`${contract.name}.${this.name}`);
  }
}
