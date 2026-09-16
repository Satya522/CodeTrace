import os
import re

appheader_path = r'c:\Users\18112\Desktop\CodeTrace\codetrace\src\frontend\views\HomeView\AppHeader.tsx'
codetraceapp_path = r'c:\Users\18112\Desktop\CodeTrace\codetrace\src\frontend\views\HomeView\CodeTraceApp.tsx'
mainworkspace_path = r'c:\Users\18112\Desktop\CodeTrace\codetrace\src\frontend\views\HomeView\MainWorkspace.tsx'

# 1. Update MainWorkspace.tsx
with open(mainworkspace_path, 'r', encoding='utf-8') as f:
    mw_content = f.read()

if 'editorBottomBar?: React.ReactNode;' not in mw_content:
    mw_content = mw_content.replace('activeSnippetId: string;', 'activeSnippetId: string;\n  editorBottomBar?: React.ReactNode;')

# Find where EditorPanel is rendered and add editorBottomBar
editor_panel_regex = r'(<EditorPanel\s*[\s\S]*?/>\s*</div>)'
if 'editorBottomBar}' not in mw_content:
    mw_content = re.sub(editor_panel_regex, r'\1\n        {editorBottomBar}', mw_content)
    
# Change the wrapper of EditorPanel to be flex flex-col
mw_content = mw_content.replace('className="min-h-[40vh] lg:min-h-0 h-[40vh] lg:h-auto z-10 relative lg:flex-shrink-0"', 'className="min-h-[40vh] lg:min-h-0 h-[40vh] lg:h-auto z-10 relative lg:flex-shrink-0 flex flex-col"')
mw_content = mw_content.replace('<EditorPanel', '<div className="flex-1 min-h-0 relative"><EditorPanel')
# Close the div around EditorPanel. We already matched />\s*</div>, wait, no. The regex matched <EditorPanel ... /> \n </div>. Wait, let me just use string replacement if regex is tricky.

with open(mainworkspace_path, 'w', encoding='utf-8') as f:
    f.write(mw_content)
