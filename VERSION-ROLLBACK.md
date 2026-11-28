# Restore point and rollback

Before the goal-search landing page update, the project was saved at:

- Git branch: `backup/before-goal-search-2026-11-28`
- Git tag: `v2026.11.28-pre-goal-search`

The backup branch is intended as a read-only restore point. To roll the published site back, use GitHub Desktop or GitHub to revert the landing page update commit on `main`, then push the revert. This preserves later project history and starts a new Azure deployment. The backup branch can also be checked out locally to review the saved version.
