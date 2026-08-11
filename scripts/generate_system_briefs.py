#!/usr/bin/env python3
"""Generate public, limitations-first Tetherics system briefs."""

from __future__ import annotations

import shutil
from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "briefs"
OUTPUT = ROOT / "output" / "pdf"
POSTER = ROOT / "public" / "cinematic" / "tetherics-machine-poster-4k.jpg"

PAGE = landscape(A4)
W, H = PAGE
BLACK = HexColor("#070808")
PANEL = HexColor("#111314")
PAPER = HexColor("#E8E5DE")
MUTED = HexColor("#8A8984")
RED = HexColor("#EF3D29")
GREEN = HexColor("#78C79D")
HAIRLINE = Color(232 / 255, 229 / 255, 222 / 255, alpha=0.22)


def set_meta(canvas: Canvas, title: str, subject: str) -> None:
    canvas.setTitle(title)
    canvas.setAuthor("Tetherics Systems")
    canvas.setSubject(subject)
    canvas.setCreator("Tetherics Systems public evidence generator")


def page_base(canvas: Canvas, page: int, code: str) -> None:
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, W, H, stroke=0, fill=1)
    canvas.setStrokeColor(HAIRLINE)
    for x in range(0, int(W) + 1, int(W / 8)):
        canvas.line(x, 0, x, H)
    canvas.setFont("Helvetica", 6)
    canvas.setFillColor(MUTED)
    canvas.drawString(28, H - 24, "TETHERICS SYSTEMS / PUBLIC RECORD")
    canvas.drawCentredString(W / 2, H - 24, code)
    canvas.drawRightString(W - 28, H - 24, f"PAGE {page:02d}")
    canvas.setStrokeColor(HAIRLINE)
    canvas.line(28, H - 34, W - 28, H - 34)
    canvas.line(28, 30, W - 28, 30)
    canvas.drawString(28, 18, "INDIA / 2026")
    canvas.drawRightString(W - 28, 18, "STATUS AND LIMITATIONS ARE PART OF THE RECORD")


def headline(canvas: Canvas, text: str, x: float, y: float, size: float = 48, color=PAPER) -> float:
    canvas.setFillColor(color)
    canvas.setFont("Helvetica-Bold", size)
    lines = text.split("\n")
    cursor = y
    for line in lines:
        canvas.drawString(x, cursor, line)
        cursor -= size * 0.88
    return cursor


def paragraph(canvas: Canvas, text: str, x: float, y: float, width: float, size: float = 11, color=MUTED, leading: float | None = None) -> float:
    style = ParagraphStyle(
        "body",
        fontName="Helvetica",
        fontSize=size,
        leading=leading or size * 1.45,
        textColor=color,
        alignment=TA_LEFT,
    )
    item = Paragraph(text, style)
    _, height = item.wrap(width, H)
    item.drawOn(canvas, x, y - height)
    return y - height


def label(canvas: Canvas, text: str, x: float, y: float, color=RED) -> None:
    canvas.setFillColor(color)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(x, y, text.upper())


def status(canvas: Canvas, text: str, x: float, y: float, color=RED) -> None:
    width = stringWidth(text, "Helvetica-Bold", 6) + 14
    canvas.setStrokeColor(color)
    canvas.setLineWidth(0.6)
    canvas.rect(x, y - 3, width, 16, stroke=1, fill=0)
    canvas.setFillColor(color)
    canvas.setFont("Helvetica-Bold", 6)
    canvas.drawString(x + 7, y + 2, text)


def card(canvas: Canvas, x: float, y: float, width: float, height: float, index: str, title: str, body: str) -> None:
    canvas.setFillColor(PANEL)
    canvas.setStrokeColor(HAIRLINE)
    canvas.rect(x, y, width, height, stroke=1, fill=1)
    label(canvas, index, x + 16, y + height - 20)
    canvas.setFillColor(PAPER)
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(x + 16, y + height - 52, title)
    paragraph(canvas, body, x + 16, y + height - 68, width - 32, 8.2, MUTED, 11)


def cover(canvas: Canvas, title: str, subtitle: str, code: str, page: int) -> None:
    page_base(canvas, page, code)
    if POSTER.exists():
        canvas.saveState()
        canvas.setFillAlpha(0.80)
        canvas.drawImage(ImageReader(str(POSTER)), W * 0.42, 30, W * 0.58, H - 64, preserveAspectRatio=True, anchor="c", mask="auto")
        canvas.restoreState()
    label(canvas, code, 46, H - 88)
    headline(canvas, title, 46, H - 138, 62)
    paragraph(canvas, subtitle, 48, H - 300, W * 0.39, 13, PAPER, 18)
    status(canvas, "CONCEPT VISUALIZATION", 48, 102)
    paragraph(canvas, "No physical prototype, deployment, performance, customer, or certification claim is implied.", 48, 82, W * 0.36, 7.5, MUTED, 10)
    canvas.showPage()


def build_system_brief(path: Path) -> None:
    canvas = Canvas(str(path), pagesize=PAGE)
    set_meta(canvas, "Tetherics Systems — System Brief", "Public concept, evidence and limitation record")
    cover(canvas, "EVERYTHING\nIS A SYSTEM.", "A public brief for the infrastructure between intelligence and the physical world.", "TS/BRIEF-01", 1)

    page_base(canvas, 2, "TS/BRIEF-01")
    label(canvas, "SYSTEM THESIS", 46, H - 82)
    headline(canvas, "FROM INFORMATION\nTO PHYSICAL ACTION.", 46, H - 125, 46)
    paragraph(canvas, "The Tetherics thesis is a control loop: observe an environment, construct an explicit state, reason under constraints, orchestrate dependencies, act through bounded interfaces, and use outcomes as new evidence.", 48, H - 242, W * 0.43, 12, PAPER, 17)
    items = [
        ("01", "OBSERVE", "Acquire events and sensor signals with timestamps and provenance."),
        ("02", "MODEL", "Represent state, uncertainty, recency and system boundaries."),
        ("03", "REASON", "Propose paths under policy, constraints and known evidence."),
        ("04", "ACT", "Emit bounded commands with approvals, audit and recovery."),
    ]
    for index, item in enumerate(items):
        row, column = divmod(index, 2)
        card(canvas, W * 0.52 + column * 172, H - 205 - row * 150, 158, 128, *item)
    canvas.showPage()

    page_base(canvas, 3, "TS/MACHINE-01")
    label(canvas, "NATIVE 3D ASSET", 46, H - 82)
    headline(canvas, "A REAL SCENE.\nA CLEAR STATUS.", 46, H - 125, 48)
    paragraph(canvas, "TS-MACHINE-01 is a native SceneKit scene rendered offline through Metal at 3840 × 2160. It contains articulated geometry and physically based materials. Its public status remains concept visualization.", 48, H - 250, W * 0.40, 11.5, PAPER, 16)
    facts = [
        ("MASTER", "3840 × 2160 / 24 FPS / 96 FRAMES"),
        ("GEOMETRY", "CHAMFERED CAD FORMS / 128-SEGMENT OPTICS"),
        ("RIG", "SHOULDER / ELBOW / WRIST / GRIPPER"),
        ("MATERIALS", "METAL / CERAMIC / RUBBER / OPTICAL / EMISSIVE"),
        ("RENDER", "APPLE METAL / SCENEKIT PBR / 4× MSAA"),
        ("PROVENANCE", "PUBLIC MANIFEST WITH SHA-256 DIGESTS"),
    ]
    for index, (key, value) in enumerate(facts):
        y = H - 100 - index * 58
        canvas.setStrokeColor(HAIRLINE)
        canvas.line(W * 0.53, y - 12, W - 44, y - 12)
        label(canvas, key, W * 0.53, y + 8, MUTED)
        canvas.setFillColor(PAPER)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(W * 0.67, y + 8, value)
    status(canvas, "CONCEPT VISUALIZATION", 48, 82)
    canvas.showPage()

    page_base(canvas, 4, "TRUST / EV-REGISTER-01")
    label(canvas, "EVIDENCE BOUNDARY", 46, H - 82)
    headline(canvas, "TRUST REQUIRES\nVISIBLE LIMITS.", 46, H - 125, 48)
    states = [
        ("LIVE", "A publicly operating artifact or process that can be inspected."),
        ("PILOT", "A bounded evaluation with named scope and evidence."),
        ("PROTOTYPE", "A functional build without a production claim."),
        ("SIMULATION", "Modeled behavior, not real-world performance."),
        ("CONCEPT", "Design communication only."),
        ("NOT DISCLOSED", "No public evidence; no implication substitutes for it."),
    ]
    for index, (name, body) in enumerate(states):
        row, column = divmod(index, 3)
        card(canvas, 46 + column * 250, H - 250 - row * 145, 232, 122, f"0{index + 1}", name, body)
    canvas.showPage()

    page_base(canvas, 5, "TS/BRIEF-01")
    label(canvas, "CURRENT PUBLIC DISCLOSURE", 46, H - 82)
    headline(canvas, "WHAT IS NOT\nBEING CLAIMED.", 46, H - 125, 48)
    rows = [
        ("LEGAL ENTITY / REGISTRATION", "NOT DISCLOSED"),
        ("NAMED LEADERSHIP", "NOT DISCLOSED"),
        ("CUSTOMER DEPLOYMENTS", "NO PUBLIC EVIDENCE"),
        ("PRODUCTION PERFORMANCE", "NO PUBLIC EVIDENCE"),
        ("SECURITY CERTIFICATION", "NOT CLAIMED"),
        ("PHYSICAL MACHINE PROTOTYPE", "NOT CLAIMED"),
    ]
    for index, (name, value) in enumerate(rows):
        y = H - 118 - index * 58
        canvas.setStrokeColor(HAIRLINE)
        canvas.line(W * 0.53, y - 12, W - 44, y - 12)
        label(canvas, name, W * 0.53, y + 8, MUTED)
        canvas.setFillColor(RED)
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawRightString(W - 46, y + 8, value)
    paragraph(canvas, "Interface telemetry in the cinematic experience is narrative UI. It is not a benchmark, field result, or safety assurance.", 48, 120, W * 0.40, 11.5, PAPER, 16)
    canvas.showPage()

    page_base(canvas, 6, "TS/BRIEF-01")
    label(canvas, "NEXT EVIDENCE GATES", 46, H - 82)
    headline(canvas, "NEXT EVIDENCE\nGATES.", 46, H - 125, 46)
    cards = [
        ("GATE / 01", "IDENTITY", "Publish accountable leadership, legal entity and a verifiable contact boundary."),
        ("GATE / 02", "PROTOTYPE", "Publish dated functional artifacts and a reproducible test environment."),
        ("GATE / 03", "SECURITY", "Publish threat model, data scope, control ownership and assessment evidence."),
        ("GATE / 04", "OPERATIONS", "Publish SLOs, failure tests, incident path and operating history."),
        ("GATE / 05", "OUTCOMES", "Publish baselines, samples, periods, exclusions and named methodology."),
        ("GATE / 06", "INDEPENDENT REVIEW", "Attach external evidence with dated scope and limitations."),
    ]
    for index, item in enumerate(cards):
        row, column = divmod(index, 3)
        card(canvas, 46 + column * 250, H - 250 - row * 145, 232, 122, *item)
    canvas.save()


def build_seerflow_brief(path: Path) -> None:
    canvas = Canvas(str(path), pagesize=PAGE)
    set_meta(canvas, "SeerFlow — Public System Record", "Limitations-first research and architecture record")
    cover(canvas, "SEERFLOW.\nTS/SYS-001", "A proposed commerce control system. Architecture and research direction—not a production or outcome claim.", "TS/SYS-001", 1)

    page_base(canvas, 2, "TS/SYS-001")
    label(canvas, "PUBLIC STATE", 46, H - 82)
    headline(canvas, "RESEARCH\nDIRECTION.", 46, H - 125, 52)
    paragraph(canvas, "No public customer deployment, benchmark, uptime history, integration certification, or measured business outcome is attached to this record.", 48, H - 260, W * 0.39, 13, PAPER, 18)
    status(canvas, "NO PRODUCTION CLAIM", 48, 104)
    card(canvas, W * 0.52, H - 215, 330, 138, "INTENT", "COMMERCE CONTROL LOOP", "Observe operational events, model current state, reason over risk, and coordinate bounded actions with audit and recovery.")
    card(canvas, W * 0.52, H - 372, 330, 138, "BOUNDARY", "EVIDENCE REQUIRED", "A named operator, security scope, reliability history and measured outcomes are required before advancing the public state.")
    canvas.showPage()

    page_base(canvas, 3, "TS/SYS-001")
    label(canvas, "PROPOSED LOOP", 46, H - 82)
    headline(canvas, "OBSERVE → MODEL →\nREASON → ACT.", 46, H - 125, 46)
    items = [
        ("01", "EVENTS", "Orders, inventory, payments, settlements, shipments and alerts."),
        ("02", "STATE", "Lineage, recency, uncertainty and reconciled operational context."),
        ("03", "DECISIONS", "Policy-bounded proposals with evidence and confidence."),
        ("04", "ORCHESTRATION", "Idempotent sequencing, approvals and failure boundaries."),
        ("05", "COMMANDS", "Audited actions with rollback and operator visibility."),
        ("06", "FEEDBACK", "Observed outcomes return as evidence, not assumed causality."),
    ]
    for index, item in enumerate(items):
        row, column = divmod(index, 3)
        card(canvas, 46 + column * 250, H - 250 - row * 145, 232, 122, *item)
    canvas.showPage()

    page_base(canvas, 4, "TS/SYS-001")
    label(canvas, "ADVANCEMENT GATES", 46, H - 82)
    headline(canvas, "TO REACH\nPRODUCTION.", 46, H - 125, 48)
    gates = [
        ("IDENTITY", "Named accountable operator and legal contracting entity.", "NOT PUBLISHED"),
        ("SECURITY", "Threat model, access controls, incident route and test scope.", "NOT PUBLISHED"),
        ("RELIABILITY", "SLOs, failure tests, recovery evidence and operating history.", "NOT PUBLISHED"),
        ("OUTCOMES", "Baseline, sample, period, exclusions and reviewable results.", "NOT PUBLISHED"),
    ]
    for index, (name, body, state) in enumerate(gates):
        y = H - 132 - index * 86
        label(canvas, f"GATE / 0{index + 1}", W * 0.53, y + 22)
        canvas.setFillColor(PAPER)
        canvas.setFont("Helvetica-Bold", 17)
        canvas.drawString(W * 0.53, y, name)
        paragraph(canvas, body, W * 0.67, y + 20, 210, 8.5, MUTED, 11)
        canvas.setFillColor(RED)
        canvas.setFont("Helvetica-Bold", 7)
        canvas.drawRightString(W - 46, y, state)
        canvas.setStrokeColor(HAIRLINE)
        canvas.line(W * 0.53, y - 22, W - 46, y - 22)
    paragraph(canvas, "The appropriate next public state is prototype only after a dated, testable implementation is published.", 48, 120, W * 0.40, 12, PAPER, 17)
    canvas.save()


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    system_path = PUBLIC / "tetherics-system-brief.pdf"
    seerflow_path = PUBLIC / "seerflow-system-record.pdf"
    build_system_brief(system_path)
    build_seerflow_brief(seerflow_path)
    shutil.copy2(system_path, OUTPUT / system_path.name)
    shutil.copy2(seerflow_path, OUTPUT / seerflow_path.name)
    print(system_path)
    print(seerflow_path)


if __name__ == "__main__":
    main()
