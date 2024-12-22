const redirects = [
  {
    from: "/ch13-01-general-introduction-to-smart-contracts.html",
    to: "/ch13-01-introduction-to-smart-contracts.html",
  },
  // Add other redirects as needed
];

// Create HTML files for each redirect
for (const redirect of redirects) {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; URL=${redirect.to}">
    <link rel="canonical" href="${redirect.to}">
  </head>
  <body>
    <h1>Redirecting...</h1>
    <p>This page has moved to <a href="${redirect.to}">${redirect.to}</a>.</p>
  </body>
</html>
`;

  // Write the file to the old path location
  await Bun.write(`book/html${redirect.from}`, html);
  console.log(
    `Created redirect at ${process.cwd()}/${redirect.from}: ${redirect.from} -> ${redirect.to}`,
  );
}

console.log("Redirect generation complete!");
