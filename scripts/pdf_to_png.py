#!/usr/bin/env python3
import argparse
import os
import shutil
import subprocess
import sys


def convert_with_pymupdf(pdf_path, out_dir, dpi, first, last, prefix):
    try:
        import fitz  # PyMuPDF
    except Exception:
        return False

    doc = fitz.open(pdf_path)
    page_count = doc.page_count
    if last is None:
        last = page_count
    last = min(last, page_count)
    first = max(1, first)

    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    os.makedirs(out_dir, exist_ok=True)
    for i in range(first - 1, last):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_path = os.path.join(out_dir, f"{prefix}{i+1}.png")
        pix.save(out_path)
    return True


def convert_with_gs(pdf_path, out_dir, dpi, first, last, prefix):
    gs = shutil.which("gs")
    if not gs:
        return False

    os.makedirs(out_dir, exist_ok=True)
    args = [
        gs,
        "-q",
        "-dNOPAUSE",
        "-dBATCH",
        "-sDEVICE=pngalpha",
        f"-r{dpi}",
        f"-dFirstPage={first}",
    ]
    if last is not None:
        args.append(f"-dLastPage={last}")
    out_pattern = os.path.join(out_dir, f"{prefix}%d.png")
    args.append(f"-sOutputFile={out_pattern}")
    args.append(pdf_path)

    subprocess.check_call(args)
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Convert a PDF into PNG images (one per page)."
    )
    parser.add_argument("pdf", help="Input PDF path")
    parser.add_argument(
        "-o", "--out-dir", default=".", help="Output directory (default: current)"
    )
    parser.add_argument("--dpi", type=int, default=200, help="Output DPI (default: 200)")
    parser.add_argument("--first", type=int, default=1, help="First page (1-based)")
    parser.add_argument(
        "--last", type=int, default=None, help="Last page (1-based, optional)"
    )
    parser.add_argument(
        "--prefix", default="page_", help="Output filename prefix (default: page_)"
    )
    args = parser.parse_args()

    pdf_path = os.path.abspath(args.pdf)
    out_dir = os.path.abspath(args.out_dir)
    if not os.path.exists(pdf_path):
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 2

    if convert_with_pymupdf(pdf_path, out_dir, args.dpi, args.first, args.last, args.prefix):
        return 0

    if convert_with_gs(pdf_path, out_dir, args.dpi, args.first, args.last, args.prefix):
        return 0

    print(
        "No available backend. Install PyMuPDF (pip install pymupdf) or "
        "install Ghostscript (gs).",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
