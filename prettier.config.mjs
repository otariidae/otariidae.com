/**
 * Prettier には「対象ファイルのグロブを列挙する」設定項目がありません。
 * 整形対象の範囲は、このファイルの親ディレクトリをルートとして `prettier .` とし、
 * 除外のみ `.prettierignore` で定義してください（README の scripts より）。
 */

/** @type {import("prettier").Config} */
export default { plugins: ["@shopify/prettier-plugin-liquid"] };
