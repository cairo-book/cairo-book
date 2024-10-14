use cairo_lang_macro::{derive_macro, ProcMacroResult, TokenStream};

use crate::parse::{parse_struct_info, StructInfo};

struct OpInfo {
    trait_name: String,
    fn_name: String,
    operator: String,
}

fn generate_op_trait_impl(op_info: &OpInfo, s: &StructInfo) -> String {
    let generic_params = s
        .generic_params
        .as_ref()
        .map_or(String::new(), |params| format!("<{}>", params.join(", ")));

    let trait_bounds = s
        .generic_params
        .as_ref()
        .map_or_else(String::new, |params| {
            let bounds = params
                .iter()
                .flat_map(|param| {
                    vec![
                        format!("+core::traits::{}<{}>", op_info.trait_name, param),
                        format!("+core::traits::Drop<{}>", param),
                    ]
                })
                .collect::<Vec<_>>()
                .join(",\n");
            format!("<{},\n{}>", params.join(", "), bounds)
        });

    let members_op = s
        .members
        .iter()
        .map(|member| format!("{0}: lhs.{0} {1} rhs.{0}", member, op_info.operator))
        .collect::<Vec<_>>()
        .join(", ");

    format!(
        "\n
impl {0}{1}{2}
of core::traits::{1}<{0}{3}> {{
    fn {4}(lhs: {0}{3}, rhs: {0}{3}) -> {0}{3} {{
        {0} {{ {5} }}
    }}
}}\n",
        s.name, op_info.trait_name, trait_bounds, generic_params, op_info.fn_name, members_op
    )
}

fn generate_op_assign_trait_impl(op_info: &OpInfo, s: &StructInfo) -> String {
    let generic_params = s
        .generic_params
        .as_ref()
        .map_or(String::new(), |params| format!("<{}>", params.join(", ")));

    let trait_bounds = s
        .generic_params
        .as_ref()
        .map_or_else(String::new, |params| {
            let bounds = params
                .iter()
                .flat_map(|param| {
                    vec![
                        format!("+core::ops::{0}Assign<{1}, {1}>", op_info.trait_name, param),
                        format!("+core::traits::Drop<{}>", param),
                    ]
                })
                .collect::<Vec<_>>()
                .join(",\n");
            format!("<{},\n{}>", params.join(", "), bounds)
        });

    let members_op = s
        .members
        .iter()
        .map(|member| format!("self.{0} {1}= rhs.{0}", member, op_info.operator))
        .collect::<Vec<_>>()
        .join(";\n        ");

    format!(
        "\n
impl {0}{1}Assign{2}
of core::ops::{1}Assign<{0}{3}, {0}{3}> {{
    fn {4}_assign(ref self: {0}{3}, rhs: {0}{3}) {{
        {5};
    }}
}}\n",
        s.name, op_info.trait_name, trait_bounds, generic_params, op_info.fn_name, members_op
    )
}

/// Adds implementation for the `core::traits::Add` trait.
///
/// Allows you to use the `+` operator on a type. All members of
/// the struct must already implement the `Add` trait.
#[derive_macro]
pub fn add(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Add".to_string(),
        fn_name: "add".to_string(),
        operator: "+".to_string(),
    };

    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::traits::Sub` trait.
///
/// Allows you to use the `-` operator on a type. All members of
/// the struct must already implement the `Sub` trait.
#[derive_macro]
pub fn sub(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Sub".to_string(),
        fn_name: "sub".to_string(),
        operator: "-".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::traits::Mul` trait.
///
/// Allows you to use the `*` operator on a type. All members of
/// the struct must already implement the `Mul` trait.
#[derive_macro]
pub fn mul(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Mul".to_string(),
        fn_name: "mul".to_string(),
        operator: "*".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::traits::Div` trait.
///
/// Allows you to use the `/` operator on a type. All members of
/// the struct must already implement the `Div` trait.
#[derive_macro]
pub fn div(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Div".to_string(),
        fn_name: "div".to_string(),
        operator: "/".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::ops::AddAssign` trait.
///
/// Allows you to use the `+=` operator on a type. All members of
/// the struct must already implement the `AddAssign` trait.
#[derive_macro]
fn add_assign(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Add".to_string(),
        fn_name: "add".to_string(),
        operator: "+".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_assign_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::ops::SubAssign` trait.
///
/// Allows you to use the `-=` operator on a type. All members of
/// the struct must already implement the `SubAssign` trait.
#[derive_macro]
fn sub_assign(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Sub".to_string(),
        fn_name: "sub".to_string(),
        operator: "-".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_assign_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::ops::MulAssign` trait.
///
/// Allows you to use the `*=` operator on a type. All members of
/// the struct must already implement the `MulAssign` trait.
#[derive_macro]
fn mul_assign(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Mul".to_string(),
        fn_name: "mul".to_string(),
        operator: "*".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_assign_trait_impl(&op, &s)))
}

/// Adds implementation for the `core::ops::DivAssign` trait.
///
/// Allows you to use the `/=` operator on a type. All members of
/// the struct must already implement the `DivAssign` trait.
#[derive_macro]
fn div_assign(token_stream: TokenStream) -> ProcMacroResult {
    let op = OpInfo {
        trait_name: "Div".to_string(),
        fn_name: "div".to_string(),
        operator: "/".to_string(),
    };
    let s = parse_struct_info(token_stream);

    ProcMacroResult::new(TokenStream::new(generate_op_assign_trait_impl(&op, &s)))
}
