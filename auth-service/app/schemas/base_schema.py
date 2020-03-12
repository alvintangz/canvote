from humps import camelize
from pydantic import BaseModel as PydanticBaseModel
from pydantic import Field


def to_camel(string):
    return camelize(string)


class BaseSchema(PydanticBaseModel):
    class Config:
        orm_mode = True
        alias_generator = to_camel
        allow_population_by_field_name = True


class CurrentPaginatedObject(BaseSchema):
    page: int = Field(..., description="Current page.")
    size: int = Field(..., description="Current size.")


class TotalPaginatedObject(BaseSchema):
    items: int = Field(..., description="Total number of items.")
    pages: int = Field(..., description="Total number of pages.")


class PaginatedBaseSchema(BaseSchema):
    current: CurrentPaginatedObject
    total: TotalPaginatedObject
