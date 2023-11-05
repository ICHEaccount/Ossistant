from pymongo.errors import PyMongoError
from .init import db
import uuid
import datetime


class ResultModel(db.DynamicDocument):
    col_name = 'Result'
    meta = {'collection':col_name}

    result_id = db.SequenceField(primary_key=True) 
    result = db.DynamicField(required=True)
    created= db.BooleanField(required=True, default=False)

    
class RunModel(db.DynamicDocument):
    col_name = 'Run'
    meta = {'collection':col_name}
    
    run_id = db.SequenceField(primary_key=True) 
    status = db.StringField(required=True)
    runtime = db.StringField(required=True)
    tool_id = db.StringField(required=True)
    input_uid = db.StringField()
    input_value = db.StringField(required=True)
    results = db.ListField(db.ReferenceField('ResultModel'))

    @classmethod
    def get_all_results(cls, run_id):
        result_list = []
        run_obj = cls.objects(run_id=run_id).first()
        if not run_obj:
            return None, 'Run data did not exist'
        
        for result_ref in run_obj.results:
            result = ResultModel.objects(result_id=result_ref.result_id).first()
            if result:
                result_list.append({
                    "result_id": result.result_id,
                    "result": result.result,
                    "created": result.created
                })
        return True, result_list  # Return run_list

    @classmethod
    def create_result(cls, data, run_id):
        try:
            run = cls.objects(run_id=run_id).first()
            if not run:
                return None, 'Run data did not exist'
            
            if isinstance(data,dict):
                result_obj = ResultModel(result=data)
                result_obj.save()

                run.results.append(result_obj)
            elif isinstance(data,list):
                    for item in data:
                        result_obj = ResultModel(result=item)
                        result_obj.save()
                        run.results.append(result_obj)
            else:
                return None, "Invalid data type"
            
            run.save()
            return True, 'Success'
        except Exception as e:
            return None, f'{cls.col_name} : Result Creation Error: {e}'


class ToolModel(db.DynamicDocument):
    col_name = 'Tool'
    meta = {'collection':col_name}

    tool_id = db.StringField(required=True)
    tool = db.StringField(required=True)
    created_date = db.StringField(required=True)

    @classmethod
    def create_tool(cls, tool_id, tool) -> bool:
        try:
            new_tool = ToolModel(tool_id=tool_id, tool=tool, created_date=datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%S"))
            new_tool.save()
            return True            
        except Exception as e:
            print(f'{cls.col_name} : Tool Creation Error: {e}')
            return False
        

class CaseModel(db.DynamicDocument):
    col_name = 'Case'
    meta = {'collection': col_name}
    
    case_id = db.StringField(unique=True)
    case_name = db.StringField(required=True)
    case_num = db.StringField(required=True)
    investigator = db.StringField(required=True)
    description = db.StringField(required=True)
    created_date = db.StringField(required=True)
    runs = db.ListField(db.ReferenceField('RunModel'))  

    """
    @Params
    - filter_data : DB Search criteria
    - data : data 
    """

    @classmethod 
    def create(cls, data) -> bool:
        try:
            # if 'case_id' not in data:  # _id가 없는 경우에만 수동으로 생성
            data['case_id'] = str(uuid.uuid1())
            # data['case_id'] = '1'
            new_case = cls(**data)
            new_case.save()
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

    
    @classmethod
    def create_runs(cls, case_id, tool_id, input_value,status='ready'):
        try:
            case = cls.objects(case_id=case_id).first()
            if case:
                runtime = datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%S")
                run = RunModel(tool_id=tool_id,runtime=runtime, status=status, input_value=input_value)
                run.save()
                case.runs.append(run)
                case.save()
                return run 
            else:
                print(f'{cls.col_name} : Case not found')
                return None
        except Exception as e:
            print(f'{cls.col_name} : Run Creation Error: {e}')
            return False
              
