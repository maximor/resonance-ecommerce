describe('Protractor shop page test', function() {
    let categoryElements = element.all(by.repeater('category in categories'));

    beforeEach(function () {
        browser.get('http://localhost/resonance-client/#!shop');
    });

    it('should have a title set', function() {
        expect(browser.getTitle()).toEqual('Shop');
    });

    it('testing adding to the cart from the shop', function () {
        element.all(by.repeater('furniture in furnitures')).
        get(2).element(by.css('.shop__btn')).$('button').click();
        browser.pause();

        let shopping = element(by.id('cartNumber'));
        expect(shopping.getText()).toBe('(1)');
    });

    it('testing product categories', function () {
        let categoryElements = element.all(by.repeater('category in categories'));
        expect(categoryElements.get(0).$('a').getText()).toContain('Lighting');
        expect(categoryElements.get(0).$('a').$('span').getText()).toBe('4');

        expect(categoryElements.get(1).$('a').getText()).toContain('Chairs');
        expect(categoryElements.get(1).$('a').$('span').getText()).toBe('4');

        expect(categoryElements.get(2).$('a').getText()).toContain('Tables');
        expect(categoryElements.get(2).$('a').$('span').getText()).toBe('4');

        expect(categoryElements.get(3).$('a').getText()).toContain('Bookshelves');
        expect(categoryElements.get(3).$('a').$('span').getText()).toBe('2');

        expect(categoryElements.get(4).$('a').getText()).toContain('Rugs');
        expect(categoryElements.get(4).$('a').$('span').getText()).toBe('5');
    });

    it('testing searching by category Lighting', function () {
        categoryElements.get(0).$('a').click();

        browser.pause();

        let items = element.all(by.repeater('furniture in furnitures'));
        expect(items.get(0).$('h2').$('a').getText()).toEqual('Kelton Table Lamp');
        expect(items.get(1).$('h2').$('a').getText()).toContain('Kaiser');
        expect(items.get(2).$('h2').$('a').getText()).toEqual('Soft Dog Pendant');
        expect(items.get(3).$('h2').$('a').getText()).toEqual('Verner Panton Light');
    });

    it('testing searching by category Chairs', function () {
        categoryElements.get(1).$('a').click();

        browser.pause();

        let items = element.all(by.repeater('furniture in furnitures'));
        expect(items.get(0).$('h2').$('a').getText()).toEqual('Visu Chair');
        expect(items.get(1).$('h2').$('a').getText()).toEqual('Grissini Bench');
        expect(items.get(2).$('h2').$('a').getText()).toEqual('Eazy Bean Everest Chair');
        expect(items.get(3).$('h2').$('a').getText()).toEqual('Barcelona Chair');
    });

    it('testing searching by category Tables', function () {
        categoryElements.get(2).$('a').click();

        browser.pause();

        let items = element.all(by.repeater('furniture in furnitures'));
        expect(items.get(0).$('h2').$('a').getText()).toEqual('Cross Extension Table');
        expect(items.get(1).$('h2').$('a').getText()).toEqual('Entu Side Table');
        expect(items.get(2).$('h2').$('a').getText()).toEqual('Helix Side Table');
        expect(items.get(3).$('h2').$('a').getText()).toEqual('Crossover Square Coffee Table');
    });

    it('testing searching by category Bookshelves', function () {
        categoryElements.get(3).$('a').click();

        browser.pause();

        let items = element.all(by.repeater('furniture in furnitures'));
        expect(items.get(0).$('h2').$('a').getText()).toEqual('Sapien Bookcase');
        expect(items.get(1).$('h2').$('a').getText()).toEqual('Nathan Yong Bookshelf');
    });

    it('testing searching by category Rugs', function () {
        categoryElements.get(4).$('a').click();

        browser.pause();

        let items = element.all(by.repeater('furniture in furnitures'));
        expect(items.get(0).$('h2').$('a').getText()).toEqual('Broken Stripe Rug');
        expect(items.get(1).$('h2').$('a').getText()).toEqual('Palani Kilim Rug');
        expect(items.get(2).$('h2').$('a').getText()).toContain('Edelman');
        expect(items.get(3).$('h2').$('a').getText()).toEqual('Byam Rug');
        expect(items.get(4).$('h2').$('a').getText()).toEqual('Broken Stripe Rug');
    });
});