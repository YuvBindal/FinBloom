#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: ai ts=4 sts=4 et sw=4 nu

"""
    py3compat, based on jinja2._compat
    ~~~~~~~~~~~~~~

    Some py2/py3 compatibility support based on a stripped down
    version of six so we don't have to depend on a specific version
    of it.

    :copyright: Copyright 2013 by the Jinja team.
    :license: BSD, see LICENSE for details.
"""

from __future__ import (unicode_literals, absolute_import,
                        division, print_function)
import sys

PY2 = str is bytes
PYPY = hasattr(sys, 'pypy_translation_info')
_identity = lambda x: x

# avoid flake8 F821 undefined name 'unicode'
try:
    text_type = unicode  # Python 2
    string_types = (str, unicode)
except NameError:
    text_type = str      # Python 3
    string_types = (str, )

# avoid flake8 F821 undefined name 'xrange'
try:
    range_type = xrange  # Python 2
except NameError:
    range_type = range   # Python 3

if not PY2:
    unichr = chr
    iterkeys = lambda d: iter(d.keys())
    itervalues = lambda d: iter(d.values())
    iteritems = lambda d: iter(d.items())

    import pickle
    from io import BytesIO, StringIO
    NativeStringIO = StringIO

    def reraise(tp, value, tb=None):
        if value.__traceback__ is not tb:
            raise value.with_traceback(tb)
        raise value

    ifilter = filter
    imap = map
    izip = zip
    intern = sys.intern

    implements_iterator = _identity
    implements_to_string = _identity
    get_next = lambda x: x.__next__

else:
    unichr = unichr
    iterkeys = lambda d: d.iterkeys()
    itervalues = lambda d: d.itervalues()
    iteritems = lambda d: d.iteritems()

    import cPickle as pickle  # noqa
    from cStringIO import StringIO as BytesIO, StringIO  # noqa
    NativeStringIO = BytesIO

    exec('def reraise(tp, value, tb=None):\n raise tp, value, tb')

    from itertools import imap, izip, ifilter
    intern = intern

    def implements_iterator(cls):
        cls.next = cls.__next__
        del cls.__next__
        return cls

    def implements_to_string(cls):
        cls.__unicode__ = cls.__str__
        cls.__str__ = lambda x: x.__unicode__().encode('utf-8')
        return cls

    get_next = lambda x: x.next


def encode_filename(filename):
    # avoid flake8 F821 undefined name 'unicode'
    try:               # Python 2
        if isinstance(filename, unicode):
            return filename.encode('utf-8')
    except NameError:  # Python 3
        pass
    return filename


def with_metaclass(meta, *bases):
    # This requires a bit of explanation: the basic idea is to make a
    # dummy metaclass for one level of class instanciation that replaces
    # itself with the actual metaclass.  Because of internal type checks
    # we also need to make sure that we downgrade the custom metaclass
    # for one level to something closer to type (that's why __call__ and
    # __init__ comes back from type etc.).
    #
    # This has the advantage over six.with_metaclass in that it does not
    # introduce dummy classes into the final MRO.
    class metaclass(meta):
        __call__ = type.__call__
        __init__ = type.__init__
        def __new__(cls, name, this_bases, d):
            if this_bases is None:
                return type.__new__(cls, name, (), d)
            return meta(name, bases, d)
    return metaclass('temporary_class', None, {})


try:
    from urllib.parse import quote_from_bytes as url_quote
except ImportError:
    from urllib import quote as url_quote
