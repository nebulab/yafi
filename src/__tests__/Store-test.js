jest.dontMock('../Store')
jest.dontMock('../Dispatcher')
jest.dontMock('../utils')

const Store = require('../Store')

describe('Store', () => {
  var MyStore, callback

  beforeEach(() => {
    MyStore = new Store()
    callback = jest.genMockFunction()
  })

  describe('emitChange()', () => {
    it('emits the change event"', function() {
      MyStore.addChangeListener(callback)
      MyStore.emitChange()
      expect(callback).toBeCalled()
      expect(callback.mock.calls.length).toBe(1)
    })
  })

  describe('setState()', () => {
    it('updates current state with the given data', function() {
      MyStore.setState({name: 'John'})
      expect(MyStore.getState()['name']).toBe('John')
    })

    it('emits the change event"', function() {
      MyStore.addChangeListener(callback)
      MyStore.setState({name: 'John'})
      expect(callback).toBeCalled()
      expect(callback.mock.calls.length).toBe(1)
    })
  })

  describe('addChangeListener()', () => {
    it('binds a callback for the change event"', function() {
      MyStore.addChangeListener(callback)
      expect(MyStore._events[MyStore.changeEventName()]).not.toBeUndefined()
    })
  })

  describe('removeChangeListener()', () => {
    it('removes the callback for the change event"', function() {
      MyStore.addChangeListener(callback)
      MyStore.removeChangeListener(callback)
      expect(MyStore._events[MyStore.changeEventName()]).toBeUndefined()
    })
  })

  describe('changeEventName()', () => {
    it('returns "$storeName change"', function() {
      expect(MyStore.changeEventName()).toBe('Store change')
    })
  })

  describe('bindActions()', () => {
    var dispatched = {actionType: 'MyActions.custom', payload: {a: 1}}

    beforeEach(() => {
      MyStore.callback = jest.genMockFn()
    })

    it('binds a custom callback name for a given action identifier', function() {
      MyStore.bindActions({'MyActions': {'custom': 'callback'}})
      MyStore.dispatcher.dispatch(dispatched)
      expect(MyStore.callback).toBeCalled()
      expect(MyStore.callback.mock.calls.length).toBe(1)
    })

    it('automatically binds a callback with same name of the given action', function() {
      let autoDispatched = {actionType: 'MyActions.callback', payload: {a: 1}}
      MyStore.bindActions({'MyActions': {'*': ['callback']}})
      MyStore.dispatcher.dispatch(autoDispatched)
      expect(MyStore.callback).toBeCalled()
      expect(MyStore.callback.mock.calls.length).toBe(1)
    })

    it('binds to actions with a custom prefix', function() {
      let customPrefix = {actionType: 'CustomPrefix.custom', payload: {a: 1}}
      MyStore.bindActions({'CustomPrefix': {'custom': 'callback'}})
      MyStore.dispatcher.dispatch(customPrefix)
      expect(MyStore.callback).toBeCalled()
      expect(MyStore.callback.mock.calls.length).toBe(1)
    })

    it('ignores unregistered prefix.action', function() {
      MyStore.dispatcher.dispatch(dispatched)
      expect(MyStore.callback).not.toBeCalled()
      expect(MyStore.callback.mock.calls.length).toBe(0)
    })
  })
})