class AttrData {

	private _index:ATTR_TYPE;

	private _value:number;

	public constructor(index:ATTR_TYPE,value:number) {
		this._index=index;
		this._value=value;
	}

	public get index():ATTR_TYPE{
		return this._index;
	}

	public get value():number{
		return this._value;
	}
}