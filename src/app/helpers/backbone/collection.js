import Backbone from 'backbone';
import NativeAjax from 'backbone.nativeajax';

Backbone.ajax = NativeAjax;

let BaseCollection = Backbone.Collection;

export default BaseCollection;
