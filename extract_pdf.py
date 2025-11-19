from pathlib import Path
from PyPDF2 import PdfReader
import sys
sys.stdout.reconfigure(encoding="utf-8")
path = Path('Files/Guia de Cores 2025 (2).pdf')
reader = PdfReader(path.open('rb'))
for i, page in enumerate(reader.pages, 1):
    text = page.extract_text() or ''
    print(f"\n--- Page {i} ---\n")
    print(text.strip())
