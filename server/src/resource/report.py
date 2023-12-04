from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.shared import Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_PARAGRAPH_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
from docx.enum.style import WD_STYLE

from datetime import datetime
from io import BytesIO


def report(case):
    io_stream = BytesIO()
    doc = Document()

    # Add first section
    section = doc.sections[0] if doc.sections else doc.add_section()

    # Set header
    header = section.header
    header_paragraph = header.paragraphs[0]
    header_paragraph.text = f"OSSISTANT Report\t\t{datetime.today().strftime('%Y%m%d')}"

    # Set footer
    footer = section.footer
    footer_paragraph = footer.paragraphs[0]
    footer_paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
    # Set page number
    page_number = footer_paragraph.add_run()
    page_number.font.size = Pt(10)
    # page_number.font.name = "Arial"
    page_number.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT

    xml = '<w:fldSimple %s w:instr="PAGE" />' % nsdecls('w')
    r_element = parse_xml(xml)
    footer_paragraph._p.insert_element_before(r_element, 'w:pPr')

    '''
    First page (cover page)
    '''
    # Add title
    for i in range(3):
        doc.add_paragraph()
    title = "OSSISTANT Report"
    doc.add_heading(title, 0).alignment = WD_PARAGRAPH_ALIGNMENT.CENTER

    for i in range(15):
        doc.add_paragraph()

    # Add table
    table_case_info = doc.add_table(rows=4, cols=2)
    table_case_info.style = doc.styles['Table Grid']
    table_case_info.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    row_case_name = table_case_info.rows[0].cells
    row_case_name[0].text = 'Case Name'
    row_case_name[1].text = case.case_name

    row_case_number = table_case_info.rows[1].cells
    row_case_number[0].text = 'Case Number'
    row_case_number[1].text = case.case_num

    row_investigator = table_case_info.rows[2].cells
    row_investigator[0].text = 'Investigator'
    row_investigator[1].text = case.investigator

    row_desc = table_case_info.rows[3].cells
    row_desc[0].text = 'Description'
    row_desc[1].text = case.description

    # Table alignment
    for row in table_case_info.rows:
        for idx, cell in enumerate(row.cells):
            paragraph = cell.paragraphs[0]
            run = paragraph.add_run()
            if idx % 2 == 0:  # Left column
                paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:  # Right column
                paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Table width set
    for column in table_case_info.columns:
        for cell in column.cells:
            cell.width = Pt(100)

    doc.add_page_break()  # End of cover page

    '''
    Start of main contents
    '''
    # 1. Relation
    para_relation = doc.add_paragraph()
    para_run = para_relation.add_run('Relation')
    para_run.bold = True
    para_run.underline = True
    para_run.font.size = Pt(20)
    # doc.add_picture('relation.png')

    # 2. Timeline
    para_relation = doc.add_paragraph()
    para_run = para_relation.add_run('Timeline')
    para_run.bold = True
    para_run.underline = True
    para_run.font.size = Pt(20)
    # doc.add_picture('whole.png')
    # doc.add_picture('suspect.png')
    # doc.add_picture('domain.png')

    doc.save(io_stream)
    return io_stream
