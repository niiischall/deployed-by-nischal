// Next ships declarations for `*.module.css` only. Plain global stylesheets are
// imported purely for their side effects, which stricter editor settings flag as
// an untyped module. The wildcard is less specific than Next's `*.module.css`
// pattern, so CSS modules keep their typed class-name record.
declare module '*.css';
