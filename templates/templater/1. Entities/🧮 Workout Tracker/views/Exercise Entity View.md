## `VIEW[{exerciseName}][text]`
`VIEW[{description}][text]`
```meta-bind-js-view
{imagePath} as imagePath 
---
return engine.markdown.create(`!${context.bound.imagePath}`);
```

<% await tp.file.include("[[1. Exercise Entity - Exercise History]]") %>