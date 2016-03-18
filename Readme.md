# kv-vsts-ViewLatestTestResult

A custom VSTS extension that displays the latest test results for a test case on the work item form.

# Details
* Adds a tab to the work item form
* When clicking the tab, the extension will:
 * Check if it's loaded from a test case. If the currently opened work item is not a Test Case, an error will be shown. Unfortunately, it doesn't seem to be possible to hide the extension on non-relevant work item types currently.
 * Query VSTS for the test plans, suites and configurations in which this Test Case was included
 * For each test plan, suite and configuration will display the latest test result in a grid
* From each entry in the grid, you can open the context menu to jump to the related test plan, suite or run

# Screenshots
1. The "Test Results" tab on a Test Case
![testresults-tab](LatestTestResultExtension/doc//TestCaseForm.jpg)
2. The context menu to jump to related teset plan, suite or run
![testresults-contextmenu](LatestTestResultExtension/doc//ContextMenu.jpg)

# Known issues
1. The extension will show up on every work item type. On work item types that are not "Test Case", an error message will be shown. There is currently no way to only display the extension on work items of type "Test Case".
2. The outcome is displayed as plain text in the grid. It would be nice to display the outcome icons as they are used in the "Test" hub. There is currently no way to display icons in a grid.

# Contributing
Feel free to fork this repository and submit a pull request if you have any improvements!