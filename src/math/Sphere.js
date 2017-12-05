import { Box3 } from './Box3.js';
import { Vector3 } from './Vector3.js';

/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

/**
 * 一个球体类
 * @param center  球的中心点 Vector3
 * @param radius  球的半径 Number
 * @constructor
 */
function Sphere( center, radius ) {

	this.center = ( center !== undefined ) ? center : new Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;
}

Object.assign( Sphere.prototype, {
	//设置球体中心点和半径
	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;

	},

	setFromPoints: function () {

		var box = new Box3();
		/**
		 * 从一个point数组创建一个球对象
		 */
		return function setFromPoints( points, optionalCenter ) {

			var center = this.center;

			if ( optionalCenter !== undefined ) {
				//从参数中获得center
				center.copy( optionalCenter );

			} else {
				//从这些点创建一个box，然后通过box拿到中心点
				box.setFromPoints( points ).getCenter( center );

			}

			var maxRadiusSq = 0;
			// 遍历传入的点，计算一个与中心点最远的点的距离的平方
			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}
			// 开方得到半径
			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		};

	}(),
	// clone，调用此类的copy，传入自己
	clone: function () {

		return new this.constructor().copy( this );

	},
	// 从一个球copy一个新的球对象
	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},
	// 判断是不是一个空的球对象
	empty: function () {

		return ( this.radius <= 0 );

	},
	// 判断一个点是否在球内
	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},
	// 计算一个点与球面上最近的一个点得距离
	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},
	// 判断两个球是否相交
	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},
	// 判断box和球是否相交
	intersectsBox: function ( box ) {

		return box.intersectsSphere( this );

	},
	// 判断平面是否和球相交
	intersectsPlane: function ( plane ) {

		return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

	},
	/**
	 * 将一个点限制在球的表面及内部
	 * @param point 传入的点
	 * @param optionalTarget 用来接收结果的Vector3 optional
	 * @returns {*|Vector3}
	 */
	clampPoint: function ( point, optionalTarget ) {
		//算出球中心与点得距离的平方
		var deltaLengthSq = this.center.distanceToSquared( point );

		var result = optionalTarget || new Vector3();
		//将point拷贝到result里边
		result.copy( point );
		//假如点在球外
		if ( deltaLengthSq > ( this.radius * this.radius ) ) {
			//模拟将球移动到坐标原点，然后半径标准化为1的操作
			result.sub( this.center ).normalize();
			//模拟将球还原到radius的半径，然后中心点平移到center位置的操作
			result.multiplyScalar( this.radius ).add( this.center );
			//此时得到的result就是

		}

		return result;

	},
	/**
	 * 获取包住球的一个Box对象
	 * @param optionalTarget
	 * @returns {*|Box3}
	 */
	getBoundingBox: function ( optionalTarget ) {

		var box = optionalTarget || new Box3();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},
	//对球对象应用一个矩阵变换
	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},
	//对求对象应用一个平移
	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},
	// 判断两个球对象是否重合在一起
	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	}

} );


export { Sphere };
