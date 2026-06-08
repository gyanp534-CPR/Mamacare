with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with "};" that is followed by garbage (the line after te: block closes)
# and remove everything from that garbage until "// STATE"
out = []
skip = False
for i, line in enumerate(lines):
    # Detect start of garbage: line is "};" followed by garbage on next line
    # The garbage starts at the line AFTER the te: block's closing "};"
    # We detect it by: line == "};\n" or "};\r\n" AND next line starts with "moodHero:"
    stripped = line.strip()
    if stripped == '};' and i + 1 < len(lines) and lines[i+1].strip().startswith("moodHero:'"):
        out.append(line)  # keep the "};"
        skip = True
        continue
    if skip:
        # Stop skipping when we hit the STATE comment
        if '// STATE' in line:
            skip = False
            # Also include the === line before STATE
            out.append('// ══════════════════════════════════════\n')
            out.append(line)
        continue
    out.append(line)

with open('app.js', 'w', encoding='utf-8') as f:
    f.writelines(out)

print(f"Done. Lines: {len(lines)} -> {len(out)}")
