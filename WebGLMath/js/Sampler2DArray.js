/**
 * @file WebGLMath Sampler2DArray class
 * @copyright Laszlo Szecsi 2017
 */

/**
 * @class Sampler2DArray
 * @classdesc Array of 2d samplers. May reflect an ESSL array-of-sampler2Ds uniform variable.
 * <BR> Individual [Sampler2D]{@link Sampler2D} elements are available through the index operator [].
 * @param {Number} size - The number of Sampler2D elements in the array.
 * @param {Number} baseTextureUnit - The texture unit index of the first element. Other elements are assigned to texture units contiguously.
 * @constructor
 */
var Sampler2DArray = function(size, baseTextureUnit){
  this.length = size;
  this.storage = new Int32Array(size);
  for(var i=0; i<size; i++){
  	this.storage[i] = i + baseTextureUnit;
    var element = Object.create(Sampler2D.prototype);
    element.glTexture = null;
    element.storage = this.storage.subarray(i, (i+1));
    Object.defineProperty(this, i, {value: element} );
  }
};

/**
 * @method at
 * @memberof Sampler2DArray.prototype  
 * @description Returns a Sampler2D object that captures an element of the array. The sampler is a view on the original data, not a copy.
 * @param index {Number} - Index of the element.
 * @return {SamplerCube} view on one of the array's elements
 */
Sampler2DArray.prototype.at = function(index){
  return this[index];
}

/**
 * @method commit
 * @memberof Sampler2DArray.prototype  
 * @description Sets the texture unit index of the all samplers in the array, and bind textures set to Sampler2D array elements.
 * @param {WebGLRenderingContext} gl - rendering context
 * @param {WebGLUniformLocation} uniformLocation - location of the uniform variable in the currently used WebGL program
 */
Sampler2DArray.prototype.commit = function(gl, uniformLocation){
  gl.uniform1iv(uniformLocation, this.storage);
  for(var i=0; i<this.length; i++) {
    gl.activeTexture(gl.TEXTURE0 + this.storage[i]);
    gl.bindTexture(gl.TEXTURE_2D, this[i].glTexture);
  }
};

