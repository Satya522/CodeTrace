import os
import re

directory = "src/frontend/views"

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to find the `code(props) { ... }` block and replace it.
    # Because each page has different colors, we should match the inner class.
    # Let's find the inline code class pattern:
    # return ( <code {...rest} className={className ? `${className} bg-XXX` : 'bg-XXX'}>
    
    code_func_pattern = re.compile(
        r'code\(props\) \{\s*'
        r'const \{ children, className, node, \.\.\.rest \} = props;\s*'
        r'(?:const match = /language-\(\\w\+\)/\.exec\(className \|\| \'\'\);\s*)?'
        r'(?:if \(match && match\[1\] === \'mermaid\'\) \{\s*'
        r'return <Mermaid text=\{String\(children\)\.replace\(/\\n\$\/, \'\'\)\} />;\s*'
        r'\}\s*)?'
        r'return \(\s*'
        r'<code \{\.\.\.rest\} className=\{className \? `\$\{className\} ([^`]+)` : \'[^\']+\'\}>(.*?)\s*'
        r'</ReactMarkdown>', re.DOTALL
    )

    # Actually, a simpler way is to just use standard string replacement or write a precise regex.
    # Let's search for:
    # const { children, className, node, ...rest } = props;
    # ...
    # return (
    #   <code {...rest} className={className ? `${className} MY_CLASS` : 'MY_CLASS'}>

    # A better approach: replace the entire `code(props) { ... }` up to the closing `}`.
    # Since I don't want to break Mermaid in pages that have it, let's do it carefully.
    
    # Just look for the className assignment and change it to only apply the styles if it's NOT a block.
    # Or just replace:
    # className={className ? `${className} bg-...` : 'bg-...'}
    # with
    # className={className ? className : 'bg-...'}

    # Wait, if className exists (language-python), we just want className.
    # So replace: `className={className ? \`${className} (.*?)\` : '(.*?)'}`
    # With:       `className={className ? className : '\1'}`
    
    def replacer(match):
        inner_class = match.group(1)
        return f"className={{className ? className : '{inner_class}'}}"

    new_content = re.sub(
        r'className=\{className \? `\$\{className\} ([^`]+)` : \'[^\']+\'\}',
        replacer,
        content
    )
    
    if new_content != content:
        # Also need to add prose-pre styling to the prose div so blocks look good.
        # Find `prose-img:rounded-xl prose-img:shadow-2xl"`
        # Replace with `prose-img:rounded-xl prose-img:shadow-2xl prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl"`
        new_content = new_content.replace(
            'prose-img:rounded-xl prose-img:shadow-2xl"',
            'prose-img:rounded-xl prose-img:shadow-2xl prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl"'
        )
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith("index.tsx"):
            process_file(os.path.join(root, file))
