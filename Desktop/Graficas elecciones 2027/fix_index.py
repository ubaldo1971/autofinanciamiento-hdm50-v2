
import os

file_path = r"c:\Users\Broly\Desktop\Graficas elecciones 2027\index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the second occurrence of "GENDER SUMMARY TICKER"
ticker_marker = "<!-- GENDER SUMMARY TICKER -->"
count = 0
cut_index = -1

for i, line in enumerate(lines):
    if ticker_marker in line:
        count += 1
        if count == 2:
            cut_index = i
            break

if cut_index != -1:
    print(f"Found second ticker at line {cut_index + 1}. Truncating...")
    new_content = lines[:cut_index]
    
    # Check if we need to close body/html
    # We will just append them to be safe, if they aren't there.
    # Actually, the script block ends right before this.
    # The previous line (cut_index - 1) should be "    }" or similar.
    
    new_content.append("\n</body>\n</html>")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_content)
    print("File truncated and saved.")
else:
    print("Second ticker not found. No changes made.")
