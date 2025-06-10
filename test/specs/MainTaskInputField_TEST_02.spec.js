describe('Main Task Input Field Test', () => {
    it('should take input in main task input field and return the response', async() => {
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
       await browser.pause(2000);

       //Enter main task
        await $("#mainTaskInput").setValue("Tell me about yourself");
        await browser.pause(1000);

       
    });
});