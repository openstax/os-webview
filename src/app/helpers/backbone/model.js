import Backbone from 'backbone';
import NativeAjax from 'backbone.nativeajax';

Backbone.ajax = NativeAjax;

let BaseModel = Backbone.Model;

export default BaseModel;
