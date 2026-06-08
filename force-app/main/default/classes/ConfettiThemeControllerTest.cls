@isTest
private class ConfettiThemeControllerTest {

    private static final List<String> FALLBACK = new List<String>{ '#6236FF', '#FFFFFF' };

    @isTest
    static void returnsFallbackWhenDeveloperNameIsBlank() {
        Test.startTest();
        List<String> colors = ConfettiThemeController.getThemeColors('');
        Test.stopTest();

        Assert.areEqual(FALLBACK, colors, 'A blank developer name should return the fallback palette');
    }

    @isTest
    static void returnsFallbackWhenDeveloperNameIsNull() {
        Test.startTest();
        List<String> colors = ConfettiThemeController.getThemeColors(null);
        Test.stopTest();

        Assert.areEqual(FALLBACK, colors, 'A null developer name should return the fallback palette');
    }

    @isTest
    static void returnsFallbackWhenNoThemeMatches() {
        Test.startTest();
        List<String> colors = ConfettiThemeController.getThemeColors('Theme_That_Does_Not_Exist');
        Test.stopTest();

        Assert.areEqual(FALLBACK, colors, 'An unknown theme name should return the fallback palette');
    }

    @isTest
    static void returnsConfiguredColorsForMatchingTheme() {
        // The package always ships at least one Confetti_Theme__mdt record (e.g. Classic),
        // and Custom Metadata records are visible in tests without SeeAllData.
        Confetti_Theme__mdt theme = [
            SELECT DeveloperName, Color_1__c, Color_2__c, Color_3__c, Color_4__c, Color_5__c
            FROM Confetti_Theme__mdt
            LIMIT 1
        ];

        List<String> expectedColors = new List<String>();
        for (String color : new List<String>{ theme.Color_1__c, theme.Color_2__c, theme.Color_3__c, theme.Color_4__c, theme.Color_5__c }) {
            if (String.isNotBlank(color)) {
                expectedColors.add(color);
            }
        }

        Test.startTest();
        List<String> colors = ConfettiThemeController.getThemeColors(theme.DeveloperName);
        Test.stopTest();

        Assert.areEqual(expectedColors, colors, 'Should return the non-blank colours configured on the matching theme record');
    }
}
