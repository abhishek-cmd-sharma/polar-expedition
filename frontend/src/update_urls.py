import os, glob

base_dir = r'c:\Users\Abhishek Sharma\OneDrive\Desktop\polarexpe\frontend\src'
files = glob.glob(os.path.join(base_dir, '**', '*.jsx'), recursive=True) + glob.glob(os.path.join(base_dir, '**', '*.js'), recursive=True)

config_path = os.path.join(base_dir, 'config.js')
with open(config_path, 'w', encoding='utf-8') as f:
    f.write("export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n")

for file in files:
    if file == config_path: continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'http://localhost:5000' in content:
        # Add import at the top
        depth = file.replace(base_dir, '').count(os.sep) - 1
        rel = '../' * depth + 'config' if depth > 0 else './config'
        
        import_stmt = f"import {{ API_BASE_URL }} from '{rel}';\n"
        
        # single quotes e.g. fetch('http://localhost:5000/api/auth') -> fetch(`${API_BASE_URL}/api/auth`)
        content = content.replace("'http://localhost:5000", "`\\${API_BASE_URL}")
        content = content.replace("http://localhost:5000'", "\\${API_BASE_URL}`")
        
        # backticks e.g. fetch(`http://localhost:5000/api/users/${id}`) -> fetch(`${API_BASE_URL}/api/users/${id}`)
        content = content.replace("`http://localhost:5000", "`\\${API_BASE_URL}")
        
        # fixing up io('http://localhost:5000') which becomes io(`${API_BASE_URL}`)
        content = content.replace("io(`\\${API_BASE_URL}`)", "io(API_BASE_URL)")
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(import_stmt + content)
