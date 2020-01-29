describe('Protractor home page test', function() {

    beforeEach(function () {
        browser.get('http://localhost/resonance-client/');
    });

    it('should have a title set', function() {
        expect(browser.getTitle()).toEqual('Resonance Ecommerce');
    });

    it('testing adding to the cart from home', function () {
        element.all(by.repeater('furniture in furnitures')).
        get(2).element(by.css('.product__action')).$('a').click();
        browser.pause();

        let shopping = element(by.id('cartNumber'));
        expect(shopping.getText()).toBe('(1)');
    });
});