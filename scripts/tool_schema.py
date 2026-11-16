"""Tool data shape for Python content pipeline scripts.

Defines the canonical frontmatter / API payload shape for Tool entries
so newly generated tools can carry affiliate URLs and sponsor tiers.
"""
from __future__ import annotations

from typing import Literal, TypedDict

SponsorTier = Literal["none", "basic", "featured"]


class ToolData(TypedDict, total=False):
    """Data shape matching Prisma's Tool model and content/tools/*.md frontmatter."""

    name: str
    slug: str
    description: str
    category: str
    logoUrl: str
    websiteUrl: str
    affiliateUrl: str | None
    sponsorTier: SponsorTier
    rating: float
    reviewCount: int
    features: list[str]
    tags: list[str]
    featured: bool


def format_tool_frontmatter(tool: ToolData) -> str:
    """Serialize a ToolData dict into YAML frontmatter for content/tools/*.md."""
    sponsor_tier: SponsorTier = tool.get("sponsorTier", "none")
    if sponsor_tier not in ("none", "basic", "featured"):
        sponsor_tier = "none"

    features = ", ".join(tool.get("features", []))
    tags = ", ".join(tool.get("tags", []))
    featured = "true" if tool.get("featured", False) else "false"

    lines = [
        "---",
        f'name: "{tool.get("name", "")}"',
        f'description: "{tool.get("description", "")}"',
        f'category: "{tool.get("category", "Uncategorized")}"',
        f'logoUrl: "{tool.get("logoUrl", "")}"',
        f'websiteUrl: "{tool.get("websiteUrl", "")}"',
    ]
    if tool.get("affiliateUrl"):
        lines.append(f'affiliateUrl: "{tool["affiliateUrl"]}"')
    lines.extend([
        f'sponsorTier: "{sponsor_tier}"',
        f'rating: "{tool.get("rating", 0)}"',
        f'reviewCount: "{tool.get("reviewCount", 0)}"',
        f'features: "{features}"',
        f'tags: "{tags}"',
        f'featured: "{featured}"',
        "---",
    ])
    return "\n".join(lines)
