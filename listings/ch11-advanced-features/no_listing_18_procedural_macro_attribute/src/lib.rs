// ANCHOR: rename
use cairo_lang_macro::attribute_macro;
use cairo_lang_macro::{ProcMacroResult, TokenStream};

#[attribute_macro]
pub fn rename(_attr: TokenStream, token_stream: TokenStream) -> ProcMacroResult {
    ProcMacroResult::new(TokenStream::new(
        token_stream
            .to_string()
            .replace("struct OldType", "#[derive(Drop)]\n struct RenamedType"),
    ))
}
// ANCHOR_END: rename
