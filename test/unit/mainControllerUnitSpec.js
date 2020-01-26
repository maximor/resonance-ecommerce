describe('main controller test', function () {
    let $controller;
    let $scope = {};
    let $rootScope = {};
    let furniture = {};

    beforeEach(function () {
        furniture = {
            id: "rec4xUSB0nX4q6EYC",
            fields: {
                Designer: [
                    "recHq5UoQXX3GBoPZ"
                ],
                "Units In Store": 0,
                "Materials and Finishes": [
                    "Lacquered Ash",
                    "Dark Wood"
                ],
                "Size (WxLxH)": "H 31.75\" W 18\" D 19.75\" Seat H 17.25\"",
                "Unit Cost": 382.25,
                Settings: [
                    "Office",
                    "Bedroom"
                ],
                Vendor: [
                    "recTerMyYFuEePMg7"
                ],
                Notes: "Going to use this chair in the office design for Abbott Realty @Caroline Lovessa ",
                Link: "http://www.dwr.com/product/visu-chair-wood-base.do?sortby=ourPicks",
                Name: "Visu Chair",
                Type: "Chairs",
                Picture: [
                    {
                        id: "attY5Iq09O3v3tlNd",
                        url: "https://dl.airtable.com/YcqNBOCtRtC7jTGl5MwQ_PD_29950_MAIN%3F%24large%24",
                        filename: "PD_29950_MAIN?$large$",
                        size: 23592,
                        type: "image/jpeg",
                        thumbnails: {
                            small: {
                                url: "https://dl.airtable.com/GNVwfFrLR9KEGpOhF0ML_small_PD_29950_MAIN%3F%24large%24",
                                width: 62,
                                height: 36
                            },
                            large: {
                                url: "https://dl.airtable.com/4raLdr4GSEvw5zifJdMg_large_PD_29950_MAIN%3F%24large%24",
                                width: 256,
                                height: 149
                            }
                        }
                    }
                ],
                Description: "Designer Mika Tolvanen established his Helsinki-based design office in 2001, shortly after graduating with a master’s from the Royal College of Art. In creating the Visu Chair (2012) – which is named after visu, the Finnish word for “precision” – “the task was to create a personal interpretation of the ever-relevant plywood chair,” he says. What he created are actually two different chairs: an unupholstered version with wire base and an upholstered version with wood base. Both are suitable for use in a home, restaurant or office. The unupholstered version with wire base stacks up to 14 high. Made in Lithuania. \n\nMIKA TOLVANEN is part of the Finnish Rehti Design group. After graduating from the Royal College of Art with a Master in design in 2001, Mika established his own design office in Helsinki. He has since worked with some of the world’s top designers and manufacturers. \n\nMIKA TOLVANEN ON HIS DESIGN PHILOSOPHY\nThe objective is not only to design products but rather look for occasions that need design. What really defines objects is how we use them not what they appear to be. Design should not be the one that requires attention by being special.\n\nMIKA TOLVANEN ON NEW NORDIC DESIGN\nThe way of doing design is always very personal for each designer. But the way we dwell up here has penetrated our lives and the way we design. Nordic design has always been here and there have been no gaps between periods. Only means of manufacturing have developed making new design more exciting.\n\nhttp://www.mikatolvanen.com\n",
                "Total Units Sold": 0,
                "Gross Sales": 0
            },
            createdTime: "2015-01-27T19:16:56.000Z"
        }
    });

    beforeEach(module('resonanceClientApp'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        var controller = $controller('mainController', {$scope:$scope,$rootScope:$rootScope});
    }));

    it('testing global variables', function () {
        expect($rootScope.user).toBeDefined();
        expect($rootScope.user).not.toBeNull();

        expect($rootScope.appName).toBeDefined();
        expect($rootScope.cart).toBeDefined();
        expect($rootScope.path).toBeDefined();

        expect($rootScope.appName).toBe('Resonance Ecommerce');
        expect($rootScope.cart.length).toBe(0);


    });

    it('testing addToCart global function', function () {
        $rootScope.addToCart(furniture);
        //testing after adding the furniture in the cart
        expect($rootScope.numberOfItems()).toBe(1);
        expect($rootScope.cartTotal()).toBe(382.25);

        $rootScope.removeFromCart(furniture.id);
        //testing after removing the furniture from the cart
        expect($rootScope.numberOfItems()).toBe(0);
    });
});