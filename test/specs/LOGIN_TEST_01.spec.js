describe('Test 01 for Emergent Application', () => {
    it('should open the application , login and logout', async() => {
    
        //navigating to the application
       await browser.url('https://app.emergent.sh/');
       await browser.maximizeWindow();
       await browser.pause(1000);

       //click on login button
       await $("//a[text()=' Log in']").click();
       await browser.pause(1000);

       //Enter valid credentials
       await $('//*[@name="email"]').addValue('p789483@gmail.com')
       await $('//*[@name="password"]').addValue('pankaj@01')
       await $('//*[@type="submit"]').click();
       await browser.pause(1000);

       //verify the login is successful
       await expect(browser).toHaveUrl('https://app.emergent.sh/');
       await browser.pause(1000);

       //click on the logout button and verify the login is successful

       await $("//span[text()='P']").click()
       await browser.pause(2000);
       await $('//div[text()="Logout"]').click();
       await browser.pause(1000);

       //verify the login is successful
       await expect(browser).toHaveUrl('https://app.emergent.sh/');
       await browser.pause(1000);
       
    });
});