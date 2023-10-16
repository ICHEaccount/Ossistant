from pymongo.errors import PyMongoError
from .init import db
from bson import ObjectId
class CaseModel(db.DynamicDocument):
    col_name = 'Case'
    meta = {'collection':col_name}
    case_id = db.StringField(unique=True)
    case_name = db.StringField(required=True)
    case_num = db.StringField(required=True)
    investigator = db.StringField(required=True)
    description = db.StringField(required=True)
    created_date = db.StringField(required=True)

    """
    @Params
    - filter_data : DB Search criteria
    - data : data 
    """

    @classmethod 
    def create(cls, data) -> bool:
        try:
            if 'case_id' not in data:  # _id가 없는 경우에만 수동으로 생성
                data['case_id'] = str(ObjectId())
            new_case = cls(**data)
            new_case.save()
            #new_case.insert_one()
            return new_case.case_id
        except PyMongoError as e:
            print(f'{cls.col_name} : Creation Error: {e}')
            return False
        
    @classmethod 
    def delete(cls, data) -> bool:
        try:
            cls.objects.filter(**data).delete()
            return True
        except PyMongoError as e:
            print(f'{cls.col_name} : Deletion Error')
            return False

    @classmethod 
    def modify(cls, filter_data, data) -> bool:
        try:
            cls.objects.filter(**filter_data).update(**data)
            return True
        except PyMongoError as e:
            print(f'{cls.col_name} : Modification Error: {e}')
            return False
        

