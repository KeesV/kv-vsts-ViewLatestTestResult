# kv-vsts-ViewLatestTestResult
A custom VSTS extension that displays the latest test results for a test case on the work item form.

# Details
* Adds a custom control that you can add to the `Test Case` work item type
* When loading the control, the extension will:
 * Check if it's loaded from a test case. If the currently opened work item is not a Test Case, an error will be shown.
 * Query VSTS for the test plans, suites and configurations in which this Test Case was included
 * For each test plan, suite and configuration will display the latest test result in a grid
* From each entry in the grid, you can open the context menu to jump to the related test plan, suite or run

# Getting started
* Install the extension
* Navigate to the customization page for the `Test Case` work item type in your process template. You might need to create a custom process template first. Refer to [the documentation](https://docs.microsoft.com/en-us/vsts/work/customize/process/customize-process?toc=/vsts/work/customize/toc.json&bc=/vsts/work/customize/breadcrumb/toc.json&view=vsts) to get started with that. Then, add a new page to the work item type.
![customize-wit-addpage](LatestTestResultExtension/doc/AddNewPage.jpg)
* Then, add a new group to the new page
![customize-wit-addgroup](LatestTestResultExtension/doc/AddGroup.jpg)
* When the group is created, add the custom control to it
![customize-wit-addcustomcontrol](LatestTestResultExtension/doc/AddCustomControl.jpg)
* The control doesn't need any configuration, so you can just click OK
![customize-wit-addcustomcontrol2](LatestTestResultExtension/doc/AddCustomControl2.jpg)
* The `Test Case` work item type will now contain an additional tab that shows the latest test results for that Test Case

# Screenshots
1. The "Test Results" tab on a Test Case
![testresults-tab](LatestTestResultExtension/doc/TestCaseForm.jpg)
2. The context menu to jump to related test plan, suite or run
![testresults-contextmenu](LatestTestResultExtension/doc/ContextMenu.jpg)

# Contributing
Feel free to fork this repository and submit a pull request if you have any improvements!