"""Removed is_locked

Revision ID: 463238e2c9eb
Revises: 0a112a1a9fe8
Create Date: 2020-03-09 16:33:39.932738

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '463238e2c9eb'
down_revision = '0a112a1a9fe8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('canvote_user', 'is_locked')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('canvote_user', sa.Column('is_locked', sa.BOOLEAN(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
