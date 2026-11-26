import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_callout(doc, text, speaker=True):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    
    cell = tbl.cell(0, 0)
    bg_color = "F0FDF4" if speaker else "F8FAFC"
    border_color = "059669" if speaker else "64748B"
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
    
    # Left border only
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    left = OxmlElement('w:left')
    left.set(qn('w:val'), 'single')
    left.set(qn('w:sz'), '24') # 3pt
    left.set(qn('w:space'), '0')
    left.set(qn('w:color'), border_color)
    tcBorders.append(left)
    
    for b in ['top', 'bottom', 'right']:
        node = OxmlElement(f'w:{b}')
        node.set(qn('w:val'), 'none')
        tcBorders.append(node)
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.18
    
    lines = text.strip().split('\n')
    for i, line in enumerate(lines):
        if i > 0:
            p = cell.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.18
            
        clean_line = line.replace('>', '').strip()
        # Parse bold formatting
        parts = re.split(r'(\*\*.*?\*\*)', clean_line)
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                run = p.add_run(part[2:-2])
                run.bold = True
                run.font.name = 'Arial'
                run.font.size = Pt(11)
                run.font.color.rgb = RGBColor(15, 23, 42)
            else:
                run = p.add_run(part)
                run.font.name = 'Arial'
                run.font.size = Pt(10.5)
                run.font.color.rgb = RGBColor(30, 41, 59) if speaker else RGBColor(71, 85, 105)

def build_pitch_script_docx():
    doc = Document()
    
    # Page setup: 0.75 in margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Title
    title = doc.add_paragraph()
    title.paragraph_format.space_before = Pt(0)
    title.paragraph_format.space_after = Pt(4)
    r = title.add_run("PULSEPILOT • OFFICIAL 5-MINUTE PITCH SCRIPT")
    r.font.name = 'Arial'
    r.font.size = Pt(18)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42) # Slate-900
    
    # Subtitle / Metadata
    sub = doc.add_paragraph()
    sub.paragraph_format.space_after = Pt(12)
    sr = sub.add_run("wHACKiest 2026 Online Ideathon  |  Speaker: Sarveshwaran K  |  Target Time: 4m 45s (5m Hard Cutoff)")
    sr.font.name = 'Arial'
    sr.font.size = Pt(9.5)
    sr.font.color.rgb = RGBColor(5, 150, 105) # Emerald-600
    sr.bold = True
    
    # Divider line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(12)
    p_div_run = p_div.add_run("―" * 58)
    p_div_run.font.color.rgb = RGBColor(203, 213, 225)
    
    # Read Markdown
    with open('/home/sarvesh/Documents/PulsePLot/pitch/pitch_script.md', 'r', encoding='utf-8') as f:
        md = f.read()
        
    lines = md.split('\n')
    i = 0
    in_table = False
    table_rows = []
    
    while i < len(lines):
        line = lines[i]
        
        # Heading 2
        if line.startswith('## '):
            h2 = doc.add_paragraph()
            h2.paragraph_format.space_before = Pt(14)
            h2.paragraph_format.space_after = Pt(6)
            r = h2.add_run(line[3:].strip())
            r.font.name = 'Arial'
            r.font.size = Pt(13)
            r.bold = True
            r.font.color.rgb = RGBColor(30, 58, 138) # Blue-900
            i += 1
            continue
            
        # Heading 3
        if line.startswith('### '):
            h3 = doc.add_paragraph()
            h3.paragraph_format.space_before = Pt(12)
            h3.paragraph_format.space_after = Pt(4)
            r = h3.add_run(line[4:].strip())
            r.font.name = 'Arial'
            r.font.size = Pt(11.5)
            r.bold = True
            r.font.color.rgb = RGBColor(15, 23, 42)
            i += 1
            continue
            
        # Heading 4
        if line.startswith('#### '):
            h4 = doc.add_paragraph()
            h4.paragraph_format.space_before = Pt(8)
            h4.paragraph_format.space_after = Pt(2)
            r = h4.add_run(line[5:].strip())
            r.font.name = 'Arial'
            r.font.size = Pt(10.5)
            r.bold = True
            r.font.color.rgb = RGBColor(16, 149, 193)
            i += 1
            continue
            
        # Table detection
        if line.strip().startswith('|') and '|' in line[1:]:
            table_rows.append([c.strip() for c in line.strip().split('|')[1:-1]])
            i += 1
            # Check if next line is table
            while i < len(lines) and lines[i].strip().startswith('|'):
                row_raw = lines[i].strip().split('|')[1:-1]
                if not all(set(c.strip()) <= set('-: ') for c in row_raw):
                    table_rows.append([c.strip() for c in row_raw])
                i += 1
            
            # Build Table
            if len(table_rows) > 0:
                tbl = doc.add_table(rows=len(table_rows), cols=len(table_rows[0]))
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                tbl.autofit = True
                for r_idx, r_data in enumerate(table_rows):
                    for c_idx, val in enumerate(r_data):
                        cell = tbl.cell(r_idx, c_idx)
                        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
                        if r_idx == 0:
                            set_cell_background(cell, "1E293B") # Dark slate
                            cp = cell.paragraphs[0]
                            crun = cp.add_run(val)
                            crun.font.name = 'Arial'
                            crun.font.size = Pt(9)
                            crun.bold = True
                            crun.font.color.rgb = RGBColor(255, 255, 255)
                        else:
                            if r_idx % 2 == 1:
                                set_cell_background(cell, "F8FAFC")
                            cp = cell.paragraphs[0]
                            # Bold markdown
                            cparts = re.split(r'(\*\*.*?\*\*)', val)
                            for cp_part in cparts:
                                if cp_part.startswith('**') and cp_part.endswith('**'):
                                    crun = cp.add_run(cp_part[2:-2])
                                    crun.bold = True
                                else:
                                    crun = cp.add_run(cp_part)
                                crun.font.name = 'Arial'
                                crun.font.size = Pt(8.5)
                                crun.font.color.rgb = RGBColor(51, 65, 85)
                p_space = doc.add_paragraph()
                p_space.paragraph_format.space_before = Pt(4)
                table_rows = []
            continue
            
        # Blockquote (Spoken words)
        if line.strip().startswith('>'):
            quote_block = []
            while i < len(lines) and (lines[i].strip().startswith('>') or lines[i].strip() == ''):
                if lines[i].strip().startswith('>'):
                    quote_block.append(lines[i])
                i += 1
            add_callout(doc, "\n".join(quote_block), speaker=True)
            doc.add_paragraph().paragraph_format.space_after = Pt(4)
            continue
            
        # Stage direction / Action cues: *(...)*
        if line.strip().startswith('*(') and line.strip().endswith(')*'):
            p_cue = doc.add_paragraph()
            p_cue.paragraph_format.space_before = Pt(4)
            p_cue.paragraph_format.space_after = Pt(4)
            r = p_cue.add_run("🎬 " + line.strip()[2:-2])
            r.font.name = 'Arial'
            r.font.size = Pt(9.5)
            r.italic = True
            r.font.color.rgb = RGBColor(100, 116, 139) # Slate-500
            i += 1
            continue
            
        # Regular paragraph
        if line.strip() and not line.startswith('---') and not line.startswith('#'):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                elif part.startswith('*') and part.endswith('*'):
                    r = p.add_run(part[1:-1])
                    r.italic = True
                else:
                    r = p.add_run(part)
                r.font.name = 'Arial'
                r.font.size = Pt(10)
                r.font.color.rgb = RGBColor(30, 41, 59)
                
        i += 1
        
    doc.save('/home/sarvesh/Documents/PulsePLot/pitch/pitch_script.docx')
    print("Saved pitch/pitch_script.docx")

def build_questions_docx():
    doc = Document()
    
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    # Title
    title = doc.add_paragraph()
    title.paragraph_format.space_before = Pt(0)
    title.paragraph_format.space_after = Pt(4)
    r = title.add_run("PULSEPILOT • 2-MINUTE JUDGES Q&A PLAYBOOK")
    r.font.name = 'Arial'
    r.font.size = Pt(18)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)
    
    sub = doc.add_paragraph()
    sub.paragraph_format.space_after = Pt(12)
    sr = sub.add_run("wHACKiest 2026 Online Ideathon  |  15 High-Probability Questions & 15-Second Winning Answers")
    sr.font.name = 'Arial'
    sr.font.size = Pt(9.5)
    sr.font.color.rgb = RGBColor(225, 29, 72) # Rose-600
    sr.bold = True
    
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(12)
    p_div_run = p_div.add_run("―" * 58)
    p_div_run.font.color.rgb = RGBColor(203, 213, 225)
    
    with open('/home/sarvesh/Documents/PulsePLot/pitch/questions.md', 'r', encoding='utf-8') as f:
        md = f.read()
        
    lines = md.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Heading 2 (Categories)
        if line.startswith('## '):
            h2 = doc.add_paragraph()
            h2.paragraph_format.space_before = Pt(16)
            h2.paragraph_format.space_after = Pt(6)
            r = h2.add_run(line[3:].strip())
            r.font.name = 'Arial'
            r.font.size = Pt(13)
            r.bold = True
            r.font.color.rgb = RGBColor(30, 58, 138)
            i += 1
            continue
            
        # Heading 3 (Questions)
        if line.startswith('### '):
            h3 = doc.add_paragraph()
            h3.paragraph_format.space_before = Pt(14)
            h3.paragraph_format.space_after = Pt(4)
            r = h3.add_run(line[4:].strip())
            r.font.name = 'Arial'
            r.font.size = Pt(11)
            r.bold = True
            r.font.color.rgb = RGBColor(15, 23, 42)
            i += 1
            continue
            
        # 15-Second Answer Callout
        if line.strip().startswith('> "'):
            quote_block = []
            while i < len(lines) and (lines[i].strip().startswith('>') or lines[i].strip() == ''):
                if lines[i].strip().startswith('>'):
                    quote_block.append(lines[i])
                i += 1
            add_callout(doc, "\n".join(quote_block), speaker=True)
            doc.add_paragraph().paragraph_format.space_after = Pt(4)
            continue
            
        # Bullets / Normal lines
        if line.strip().startswith('- **'):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                elif part.startswith('*') and part.endswith('*'):
                    r = p.add_run(part[1:-1])
                    r.italic = True
                else:
                    r = p.add_run(part)
                r.font.name = 'Arial'
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(51, 65, 85)
            i += 1
            continue
            
        # General non-empty line
        if line.strip() and not line.startswith('---') and not line.startswith('#'):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                elif part.startswith('*') and part.endswith('*'):
                    r = p.add_run(part[1:-1])
                    r.italic = True
                else:
                    r = p.add_run(part)
                r.font.name = 'Arial'
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(30, 41, 59)
                
        i += 1
        
    doc.save('/home/sarvesh/Documents/PulsePLot/pitch/questions.docx')
    print("Saved pitch/questions.docx")

if __name__ == '__main__':
    build_pitch_script_docx()
    build_questions_docx()
