mod aggregator {
    //ANCHOR: trait
    pub trait Summary<T> {
        fn summarize(
            self: @T,
        ) -> ByteArray {
            format!("(Read more from {}...)", Self::summarize_author(self))
        }
        fn summarize_author(self: @T) -> ByteArray;
    }
    //ANCHOR_END: trait

    #[derive(Drop)]
    pub struct Tweet {
        pub username: ByteArray,
        pub content: ByteArray,
        pub reply: bool,
        pub retweet: bool,
    }

    //ANCHOR: impl
    impl TweetSummary of Summary<Tweet> {
        fn summarize_author(self: @Tweet) -> ByteArray {
            format!("@{}", self.username)
        }
    }
    //ANCHOR_END: impl
}

//ANCHOR: main
use aggregator::{Summary, Tweet};

fn main() {
    let tweet = Tweet {
        username: "EliBenSasson",
        content: "Crypto is full of short-term maximizing projects. \n @Starknet and @StarkWareLtd are about long-term vision maximization.",
        reply: false,
        retweet: false,
    };

    println!("1 new tweet: {}", tweet.summarize());
}
//ANCHOR_END: main


