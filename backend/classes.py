from pydantic import BaseModel
from typing import Optional, List


class User(BaseModel):
    id: str
    username: str
    email: str
    name: str
    picture: str


class MovieShort(BaseModel):
    id: str
    title: str
    year: str


class MovieUser(BaseModel):
    liked: bool = False
    watched: bool = False
    follow: List[User] = []
