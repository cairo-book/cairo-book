#[derive(Drop, Clone)]
struct NewsArticle {
    headline: ByteArray,
    location: ByteArray,
    author: ByteArray,
    content: ByteArray,
}

//ANCHOR: trait
pub trait Summary {
    fn summarize(self: @NewsArticle) -> ByteArray;
}
//ANCHOR_END: trait

//ANCHOR: impl
impl NewsArticleSummary of Summary {
    fn summarize(self: @NewsArticle) -> ByteArray {
        format!("{:?} by {:?} ({:?})", self.headline, self.author, self.location)
    }
}
//ANCHOR_END: impl


