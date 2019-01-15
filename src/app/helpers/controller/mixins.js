// Basics of https://github.com/justinfagnani/mixwith.js
// which may be added in later, but don't yet know we need it
// See http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
class MixinBuilder {

    constructor(superclass) {
        this.superclass = superclass;
    }

    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }

}

export default function mix(superclass) {
    return new MixinBuilder(superclass);
}
