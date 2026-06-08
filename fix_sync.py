with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old = '}sync function deleteFood'
new = '}\n\nasync function deleteFood'

if old in content:
    content = content.replace(old, new, 1)
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed!')
else:
    print('Pattern not found')
    # Show context around deleteFood
    idx = content.find('function deleteFood')
    print(repr(content[idx-5:idx+30]))
