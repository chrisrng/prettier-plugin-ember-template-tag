import type {
  ExportDefaultDeclaration,
  ExpressionStatement,
  Node,
  TSAsExpression,
  TemplateLiteral,
} from '@babel/types';
import {
  isArrayExpression,
  isClassProperty,
  isExportDefaultDeclaration,
  isExpressionStatement,
  isNode,
  isTSAsExpression,
  isTemplateLiteral,
} from '@babel/types';
import type { RawGlimmerArrayExpression, RawGlimmerClassProperty } from './raw';

/**
 * A Template Literal with a tag indicating that it is actually a Glimmer
 * Template
 */
export interface GlimmerTemplateLiteral extends TemplateLiteral {
  extra: GlimmerTemplateExtra;
}

export interface GlimmerTemplateExtra {
  isGlimmerTemplate: true;
  [key: string]: unknown;
}

/** Type predicate */
export function isGlimmerTemplateLiteral(
  node: Node | null | undefined,
): node is GlimmerTemplateLiteral {
  return isTemplateLiteral(node) && node.extra?.['isGlimmerTemplate'] === true;
}

export interface GlimmerExpressionExtra {
  forceSemi: boolean;
  isGlimmerTemplate: true;
  isDefaultTemplate?: boolean;
  [key: string]: unknown;
}

export type GlimmerExpression = GlimmerArrayExpression | GlimmerClassProperty;

/** Type predicate */
export function isGlimmerExpression(
  node: Node | null | undefined,
): node is GlimmerExpression {
  return node?.extra?.['isGlimmerTemplate'] === true;
}

export interface GlimmerArrayExpression extends RawGlimmerArrayExpression {
  extra: GlimmerExpressionExtra;
}

/** Type predicate */
export function isGlimmerArrayExpression(
  node: Node | null | undefined,
): node is GlimmerArrayExpression {
  return isArrayExpression(node) && isGlimmerExpression(node);
}

export interface GlimmerClassProperty extends RawGlimmerClassProperty {
  extra: GlimmerExpressionExtra;
}

/** Type predicate */
export function isGlimmerClassProperty(
  node: Node | null | undefined,
): node is GlimmerClassProperty {
  return isClassProperty(node) && isGlimmerExpression(node);
}

/**
 * @example
 *
 * ```gts
 * export default <template>hello</template>;
 * ```
 */
export interface GlimmerExportDefaultDeclaration
  extends Omit<ExportDefaultDeclaration, 'declaration'> {
  declaration: GlimmerExpression;
}

/** Type predicate */
export function isGlimmerExportDefaultDeclaration(
  node: unknown,
): node is GlimmerExportDefaultDeclaration {
  return (
    isNode(node) &&
    isExportDefaultDeclaration(node) &&
    isGlimmerExpression(node.declaration)
  );
}

/**
 * @example
 *
 * ```gts
 * export default <template>hello</template> as Component<MySignature>
 * ```
 */
export interface GlimmerExportDefaultDeclarationTS
  extends Omit<ExportDefaultDeclaration, 'declaration'> {
  declaration: GlimmerTSAsExpression;
}

/** Type predicate */
export function isGlimmerExportDefaultDeclarationTS(
  node: unknown,
): node is GlimmerExportDefaultDeclarationTS {
  return (
    isNode(node) &&
    isExportDefaultDeclaration(node) &&
    isGlimmerTSAsExpression(node.declaration)
  );
}

/**
 * This is the TypeScript `as` expression used in many of the other TS nodes,
 *
 * @example
 *
 * ```ts
 * export default <template>Hello</template> as Component<MySignature>
 *                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ```
 */
export interface GlimmerTSAsExpression
  extends Omit<TSAsExpression, 'expression'> {
  expression: GlimmerExpression;
}

/** Type predicate */
export function isGlimmerTSAsExpression(
  node: unknown,
): node is GlimmerTSAsExpression {
  return (
    isNode(node) &&
    isTSAsExpression(node) &&
    isGlimmerExpression(node.expression)
  );
}

/**
 * @example
 *
 * ```gts
 * <template>hello</template>;
 * ```
 */
export interface GlimmerExpressionStatement
  extends Omit<ExpressionStatement, 'expression'> {
  expression: GlimmerExpression;
}

/** Type predicate */
export function isGlimmerExpressionStatement(
  node: unknown,
): node is GlimmerExpressionStatement {
  return (
    isNode(node) &&
    isExpressionStatement(node) &&
    isGlimmerExpression(node.expression)
  );
}

/**
 * @example
 *
 * ```gts
 * <template>hello</template> as Component<MySignature>
 * ```
 */
export interface GlimmerExpressionStatementTS
  extends Omit<ExpressionStatement, 'expression'> {
  expression: GlimmerTSAsExpression;
}

/** Type predicate */
export function isGlimmerExpressionStatementTS(
  node: unknown,
): node is GlimmerExpressionStatementTS {
  return (
    isNode(node) &&
    isExpressionStatement(node) &&
    isGlimmerTSAsExpression(node.expression)
  );
}

/** Returns the `GlimmerExpression` within the given `path`. */
export function getGlimmerExpression(
  node:
    | GlimmerExportDefaultDeclaration
    | GlimmerExportDefaultDeclarationTS
    | GlimmerExpressionStatement
    | GlimmerExpressionStatementTS
    | GlimmerClassProperty
    | GlimmerArrayExpression,
): GlimmerExpression {
  switch (node.type) {
    case 'ExportDefaultDeclaration': {
      return 'expression' in node.declaration
        ? node.declaration.expression
        : node.declaration;
    }
    case 'ExpressionStatement': {
      return 'expression' in node.expression
        ? node.expression.expression
        : node.expression;
    }
    case 'ClassProperty':
    case 'ArrayExpression': {
      return node;
    }
  }
}
