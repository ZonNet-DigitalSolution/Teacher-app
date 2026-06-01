# Disabled Dependencies

## Reason

These packages were disabled because **Expo Router v6 (SDK 56+)** is not compatible with `react-navigation`.

Expo Router replaces the need for react-navigation with file-based routing.

## Disabled Packages

The following packages were removed from `package.json` dependencies:

```json
{
  "disabled_dependencies": {
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8"
  }
}
```

## How to Re-enable

If you need these packages again, uncomment them in `package.json` dependencies and run:

```bash
npm install
```

## Reference

- [Expo Router Migration Guide](https://docs.expo.dev/router/migrate/sdk-55-to-56/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
