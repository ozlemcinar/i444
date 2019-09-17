'use strict';

const assert = require('assert');

class Sensors {

  constructor() {
    this.clear();
  }
  async clear() {
	this.sensorTypes = {};
	this.sensors = {};
	this.sensorDatas = {};
	
  }

  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    this.sensorTypes[sensorType.id] = sensorType;
  }
  
  async addSensor(info) {
        const sensor = validate('addSensor', info);

        if (this.sensorTypes[sensor.model]===false) {
            throw [`model is invalid.`];
        }

        else{
		this.sensors[sensor.id] = sensor
	}
    }

  async addSensorData(info) {
        const sensorData = validate('addSensorData', info);

        if (this.sensors[sensorData.sensorId]===false) {
            throw [`sensorId is invalid.`];
        }

        if (!this.sensorDatas[sensorData.sensorId]) {
            this.sensorDatas[sensorData.sensorId] = [];
        }

        this.sensorDatas[sensorData.sensorId].push(sensorData)
    }

  async findSensorTypes(info) {
        const searchSpecs = validate('findSensorTypes', info);

        if (searchSpecs.id) {
		if(!sensorTypes[searchSpecs.id]){
			throw [`the objects is invalid`];
		}
		else{
			const listed = [];
			this.sensorTypes.sort().forEach((key) => listed.push(this.sensorTypes[key]))
		}
        }

        const lastIndex = listed[listed.length -1];
        return lastIndex
    }
  
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);

        if (searchSpecs.id) {
            const sensor = this.sensors[searchSpecs.id];

            if (searchSpecs.doDetail) {
                const sensorType = this.sensorTypes[sensor.model];

                return sensorType;
            }
            return sensor;
        }

        const listed = []	
        const listedKeys = this.sensors.sort();

        if (searchSpecs.doDetail) {
            listedKeys.forEach((key) => {
                const sensorType = this.sensorTypes[sensors[key].model];
                listed.push( sensorType)
            })
        } else {
            listedKeys.forEach((key) => {
                listed.push(this.sensors[key])
            })
        }
        const lastIndex = listed[listed.length-1];
        return lastIndex;
        return lastIndex;
  }
  

  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    if(!sensorTypes[sensor.model]){ ///sensorType
	throw [`the object is invalid`];
    }

    if(!sensors[searchSpecs.sensorId]){ ///sensor
	throw [`the object is invalid`];
    }
    if(!sensorDatas[searchSpecs.sensorId]){ /// sensorDatas
	throw [`the object is invalid`];
    }

        return {};
  
  }
}

module.exports = Sensors;


const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function inRange (value,range){
	if(value<range.min){
		return false;
	}
	else if(value>range.max){
		return false;
	}
	else{
		return true;
	}
  }


function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  

