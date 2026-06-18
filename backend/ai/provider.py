"""Anthropic SDK wrapper — Claude Sonnet 4.6."""
from __future__ import annotations
import os
import anthropic

_client: anthropic.Anthropic | None = None
_key_verified: bool | None = None  # None=untested, True=valid, False=invalid


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        key = os.getenv("ANTHROPIC_API_KEY", "")
        if not key:
            raise ValueError("ANTHROPIC_API_KEY not set")
        _client = anthropic.Anthropic(api_key=key)
    return _client


def has_api_key() -> bool:
    key = os.getenv("ANTHROPIC_API_KEY", "")
    return bool(key) and key != "your_key_here"


def chat(system_prompt: str, messages: list[dict]) -> str:
    global _key_verified
    if _key_verified is False:
        raise ValueError("API key previously verified as invalid — using mock mode")
    try:
        response = _get_client().messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system_prompt,
            messages=messages,
        )
        _key_verified = True
        block = response.content[0]
        return block.text if block.type == "text" else ""
    except anthropic.AuthenticationError:
        _key_verified = False
        raise ValueError("ANTHROPIC_API_KEY is invalid (401). Update it in .env to enable AI features.")
    except anthropic.APIConnectionError as e:
        raise ValueError(f"Cannot reach Anthropic API: {e}")


def mock_reply(user_message: str) -> str:
    lower = user_message.lower()
    if "roadmap" in lower:
        return (
            "**From Your Future Self:**\nYou asked for a roadmap — smart move.\n\n"
            "**Next 7 Days:** Audit your current skills honestly.\n"
            "**Next 30 Days:** Pick ONE skill gap and start a beginner project.\n"
            "**Next 3 Months:** Have one tangible output to show.\n"
            "**Next 6 Months:** Apply to 10 opportunities.\n"
            "**Next 1 Year:** Validate your direction or pivot with evidence.\n\n"
            "**Your Next 3 Actions:**\n1. Complete your profile\n2. Take the Interest Test\n3. Start one project this week"
        )
    return (
        "**From Your Future Self:**\nI remember asking the same thing.\n\n"
        "**Your Next 3 Actions:**\n1. Take the Career GPS quiz\n2. Take the Interest Test\n3. Ask me something specific"
    )
