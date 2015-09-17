from __future__ import unicode_literals, print_function
import pandas
from collections import OrderedDict as _OrderedDict
from collections import Mapping as _Mapping
from mpcontribs.config import mp_level01_titles

class RecursiveDict(_OrderedDict):
    """extension of dict for internal representation of MPFile"""

    def rec_update(self, other=None, overwrite=False):
        """https://gist.github.com/Xjs/114831"""
        # overwrite=False: don't overwrite existing unnested key
        # TODO make sure to keep original insertion order when updating
        if other is None: other = self # mode to force RecursiveDicts to be used
        for key,value in other.items():
            new_key = key.replace('_', ' ')
            self_value = self.pop(key, None)
            if self_value is not None and \
               isinstance(self_value, dict) and \
               isinstance(value, dict):
                # ensure RecursiveDict and update key (w/o underscores)
                self[new_key] = RecursiveDict(self_value)
                self[new_key].rec_update(other=value, overwrite=overwrite)
            elif self_value is None:
                self[new_key] = value
            elif self_value is not None:
                self[new_key] = value if overwrite else self_value

    def iterate(self, nested_dict=None):
        """http://stackoverflow.com/questions/10756427/loop-through-all-nested-dictionary-values"""
        d = self if nested_dict is None else nested_dict
        if nested_dict is None: self.level = 0
        self.table = None
        for key,value in d.iteritems():
            if isinstance(value, _Mapping):
                yield (self.level, key), None
                self.level += 1
                iterator = self.iterate(nested_dict=value)
                while True:
                    try:
                        inner_key, inner_value = iterator.next()
                    except StopIteration:
                        if self.level > 0 and self.table:
                            yield None, self.table
                            self.table = None
                        break
                    yield inner_key, inner_value
                self.level -= 1
            elif isinstance(value, list):
                if isinstance(value[0], dict):
                    # index (from archieml parser)
                    if self.table is None: self.table = ''
                    for row_dct in value:
                        self.table = '\n'.join([
                            self.table, row_dct['value']
                        ])
                    yield ' '.join([mp_level01_titles[1], key]), self.table
                    self.table = None
                else:
                    if self.table is None:
                        self.table = RecursiveDict()
                    self.table[key] = value # columns
            else:
                yield (self.level, key), value

    # insertion mechanism from https://gist.github.com/jaredks/6276032
    def __insertion(self, link_prev, key_value):
        key, value = key_value
        if link_prev[2] != key:
            if key in self:
                del self[key]
            link_next = link_prev[1]
            self._OrderedDict__map[key] = link_prev[1] = link_next[0] = [link_prev, link_next, key]
        dict.__setitem__(self, key, value)

    def insert_after(self, existing_key, key_value):
        self.__insertion(self._OrderedDict__map[existing_key], key_value)

    def insert_before(self, existing_key, key_value):
        self.__insertion(self._OrderedDict__map[existing_key][0], key_value)
