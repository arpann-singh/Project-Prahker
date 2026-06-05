# Security Specification - Echo Lens

## Data Invariants
1. A **User** document path must match their `uid` from Firebase Auth.
2. A **Workspace** can only be accessed (read/write) by its owner (`userId`).
3. A **Session** must be linked to a Workspace, and users can only see sessions linked to workspaces they own.
4. **Responses** are sub-resources of a Session and inherit access from it.
5. `createdAt` and `userId` fields are immutable after document creation.
6. `updatedAt` must always be synced with `request.time`.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Creating a workspace for someone else (`userId` != auth.uid).
2. **Path Traversal**: Trying to use a malicious string as a document ID (e.g., `../../hack`).
3. **Ghost Field Injection**: Adding an `isAdmin` field to a user profile to gain privileges.
4. **Foreign Access**: Reading a session belonging to another user.
5. **Orphaned Writes**: Creating a session that references a non-existent workspace.
6. **Immutable Field Poisoning**: Attempting to change `userId` on an existing workspace.
7. **Future Timestamps**: Setting `createdAt` to a future date instead of `request.time`.
8. **Resource Exhaustion**: Sending a 1MB string as a workspace name.
9. **State Shortcut**: Forcing a `judgeResult` into a session before it's actually processed.
10. **Admin Escalation**: Attempting to write to an `admins` collection directly.
11. **Type Mismatch**: Sending a boolean for `latencyMs`.
12. **Missing required fields**: Creating a session without a `prompt`.

## Test Runner (Logic Outline)
The following tests verify that all malicious payloads are blocked.
- `it('blocks cross-user workspace creation')`
- `it('blocks invalid ID characters')`
- `it('blocks extra fields in user profile')`
- `it('blocks updating immutable createdAt')`
- `it('blocks non-owner reading private sessions')`
