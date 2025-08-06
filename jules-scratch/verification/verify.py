import re
from playwright.sync_api import Page, expect
import pytest

# It's good practice to increase the default timeout for web applications
# that may have network latency or slow API responses.
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "http://localhost:3000",
        "viewport": {
            "width": 1280,
            "height": 720,
        }
    }

def test_new_reservation_flow(page: Page):
    """
    Tests the new user reservation flow from the landing page to confirmation.
    """
    # 1. Navigate to the new landing page
    page.goto("/u/accueil")
    expect(page.get_by_role("heading", name="Découvrez une Expérience Culinaire Inoubliable")).to_be_visible()

    # 2. Click the main "Réserver" button to start the flow
    # Using a more specific locator to get the central button
    page.locator('//div[contains(@class, "relative z-10")]//a[text()="Réserver"]').click()

    # 3. On the reservation page, fill out the form
    expect(page).to_have_url(re.compile(r"/u/reserver"))
    expect(page.get_by_role("heading", name="Réserver une table")).to_be_visible()

    # The party size and date are already defaulted, which is fine for this test.

    # Wait for time slots to be loaded and click an available one.
    # We look for a button that is not disabled.
    # Increased timeout to handle potentially slow API calls.
    available_slot = page.locator('button[type="button"]:not([disabled])').first
    expect(available_slot).to_be_visible(timeout=15000)
    slot_time = available_slot.inner_text()
    available_slot.click()

    # Click the main "Réserver" button to proceed to confirmation
    page.get_by_role("button", name="Réserver").click()

    # 4. On the confirmation page, verify details
    expect(page).to_have_url(re.compile(r"/u/confirmation"))
    expect(page.get_by_role("heading", name="Confirm your reservation")).to_be_visible()

    # Check that the details from the previous page are displayed correctly
    expect(page.locator('//p[text()="Guests"]/following-sibling::p')).to_have_text("2")
    expect(page.locator('//p[text()="Time"]/following-sibling::p')).to_have_text(slot_time)

    # 5. Click the final confirmation button
    page.get_by_role("button", name="Confirm Reservation").click()

    # 6. Expect a success toast and take a screenshot
    expect(page.get_by_text("Réservation confirmée avec succès !")).to_be_visible(timeout=10000)

    page.screenshot(path="jules-scratch/verification/screenshot.png")
