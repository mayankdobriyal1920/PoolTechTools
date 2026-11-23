# Lost Device Recovery Runbook

## Self-Service (user still has browser data)
1. User goes to `/pro/activate`.
2. Clicks "Load Devices" to see activated devices.
3. Clicks "Deactivate" on the lost device (if they still have access to that browser).
4. Slot is freed; user can activate on new device.

## Support Process (user lost access to old device)
1. User contacts support with purchase email.
2. Support verifies email ownership (send verification link to purchase email).
3. After verification, support deactivates ALL devices for that license.
4. User re-activates on new device(s).
5. Old tokens remain valid until 14-day expiry (documented limitation).

## Automated (optional, future)
- Add `POST /api/license/deactivate-all` endpoint gated by recovery verification token.
- Requires email verification flow (already scaffolded in `/api/license/recover`).
